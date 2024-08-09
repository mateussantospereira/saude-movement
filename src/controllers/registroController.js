const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { response } = require("../helpers/response");
const { checkInputs } = require("../helpers/checkInputs");
const registroClient = require("../clients/registroClient");
const registroField = require("../fields/registroField");
const registroSupport = require("../supports/registroSupport");
const registroAssistence = require("../assistences/registroAssistence");
const deleteFile = require("../helpers/deleteImportedFile");
const xlsxService = require("../services/xlsxService");
const pdfService = require("../services/pdfService");
const historicoClient = require("../clients/historicoClient");
const fs = require("fs");

class registroController {
    async listar(req, res) {
        const response = await registroClient.listar();
        return res.status(response.status).json(response);
    }

    async listarPorTipo(req, res) {
        const { tipo } = req.params;
        const response = await registroClient.listarPorTipo(tipo);
        return res.status(response.status).json(response);
    }

    async listarTipos(req, res) {
        const response = await registroClient.listarTipos();
        return res.status(response.status).json(response);
    }

    async buscar(req, res) {
        const { email } = req.params;
        const response = await registroClient.buscar(email);
        return res.status(response.status).json(response);
    }

    async validar(req, res) {
        const fields = await registroField.validar();
        let resultInputs = checkInputs(req.body, fields);
        let reqData = resultInputs.data;

        if (resultInputs.error == true) {
            return response(res, 400, true, resultInputs.message);
        }

        return validar(reqData);

        async function validar(data) {
            const support = await registroSupport.validar(data);

            if (support.status != 200) {
                return res.status(support.status).json(support);
            }

            await registroAssistence.createSession(req, support.data);
            const token = await registroAssistence.createToken(support.data);

            support.data = {
                nome: support.data.nome,
                email: support.data.email,
                token: token
            };

            return res.status(support.status).json(support);
        }
    }

    async verificar(req, res) {
        const token = req.body.token;

        try {
            const decode = await promisify(jwt.verify)(token, process.env.SECRET);
            response(res, 200, false, "Token válido", decode);
        } catch (error) {
            response(res, 400, true, "Token inválido");
        }
    }

    async criar(req, res) {
        const support = await registroSupport.criar(req.body);
        return res.status(support.status).json(support);
    }

    async importar(req, res) {
        const fileName = `${Date.now()}${req["sessionID"]}`;
        const importarField = await registroField.importar();
        const kilobyte = importarField.kilobyte;

        const service = await xlsxService.createImportedFile(req, kilobyte, fileName);

        if (service.status != 201) {
            return deleteFile(res, fileName, 400, true, service.message);
        }

        return await readXLSX();

        async function readXLSX() {
            async function readFile() {
                const fields = importarField.fields;
                const support = await registroSupport.valideXLSX(service.data, fields);

                if (support.status != 200) {
                    return deleteFile(res, fileName, 400, true, support.message);
                }

                return registrar(support.data);

                async function registrar(data) {
                    for (let line of data) {
                        const registro = await registroSupport.atualizar(line);

                        if (registro.status != 201) {
                            return deleteFile(res, fileName, 400, true, "Erro ao cadastrar lista de registros.");
                        }
                    }

                    return deleteFile(res, fileName, 201, false, "Importação concluída com êxito.");
                }
            }

            try {
                return await readFile();
            } catch (error) {
                console.log(error)
                return deleteFile(res, fileName, 
                    400, true, "Erro ao ler arquivo. Envie um arquivo XLSX válido.");
            }
        }
    }

    async exportar(req, res) {
        const fileName = `${Date.now()}${req["sessionID"]}`;
        const body = { list: `${req.body.list},` };
        const fields = await registroField.exportar();
        const support = await registroSupport.valideList(body, fields.list);

        if (support.status != 200) {
            return res.status(support.status).json(support);
        }

        createXLSX(support.data, fields.head);

        async function createXLSX(data, head) {
            const client = await xlsxService.exportar(data, head, fileName);

            res.status(client.status).json(client);

            if (client.status == 201) {
                new Promise(() => {
                    setTimeout(() => {
                        fs.unlinkSync((`./${client.data}`));
                    }, 3000);
                });
            }
        }
    }

    async importarAtualizacao(req, res) {
        const fileName = `${Date.now()}${req["sessionID"]}`;
        const importarField = await registroField.importarAtualizacao();
        const kilobyte = importarField.kilobyte;

        const service = await xlsxService.createImportedFile(req, kilobyte, fileName);

        if (service.status != 201) {
            return deleteFile(res, fileName, 400, true, service.message);
        }

        return await readXLSX();

        async function readXLSX() {
            async function readFile() {
                const fields = importarField.fields;
                const support = await registroSupport.valideUpdateXLSX(service.data, fields);

                if (support.status != 200) {
                    return deleteFile(res, fileName, 400, true, support.message);
                }

                return registrar(support.data);

                async function registrar(data) {
                    for (let line of data) {
                        let email = line.email;
                        delete line.idade;
                        delete line.email;
                        const registro = await registroSupport.atualizar(email, line);

                        console.log(line)
                        console.log(registro)
                        if (registro.status != 200) {
                            return deleteFile(res, fileName, 400, true, registro.message);
                        }
                    }

                    return deleteFile(res, fileName, 201, false, "Importação concluída com êxito.");
                }
            }

            try {
                return await readFile();
            } catch (error) {
                console.log(error)
                return deleteFile(res, fileName, 
                    400, true, "Erro ao ler arquivo. Envie um arquivo XLSX válido.");
            }
        }
    }

    async imprimirRelatorio(req, res) {
        const fileName = `${Date.now()}${req["sessionID"]}`;
        const { email } = req.params;
        const fields = await registroField.imprimir();
        let resultInputs = checkInputs(req.body, fields.inputs);

        if (resultInputs.error == true) {
            return response(res, 400, true, resultInputs.message);
        }

        const client = await historicoClient.listar(email);

        if (client.status != 200) {
            return res.status(client.status).json(client);
        }

        client["data"].forEach((i) => {
            i.email = email;
        });

        let text = `
            <div class="text">
                <h3>Histórico de saúde do colaborador</h3>
                <p>Este é o relatório do histórico saúde do colaborador ${client.data[0].nome}.</p>
            </div>
        `;

        gerarPDF(client.data, fields.options, fields.head, text);

        async function gerarPDF(data, options, head, text) {
            const service = await pdfService.imprimir(data, options, head, text, fileName);

            res.status(service.status).json(service);

            if (service.status == 201) {
                new Promise(() => {
                    setTimeout(() => {
                        fs.unlinkSync((`./${service.data}`));
                    }, 3000);
                });
            }
        }
    }

    async imprimirLista(req, res) {
        const fileName = `${Date.now()}${req["sessionID"]}`;
        const body = { list: `${req.body.list},` };
        const fields = await registroField.imprimir();
        const support = await registroSupport.valideList(body, fields.list);

        if (support.status != 200) {
            return res.status(support.status).json(support);
        }

        gerarPDF(support.data, fields.options, fields.head, fields.textList);

        async function gerarPDF(data, options, head, text) {
            const service = await pdfService.imprimir(data, options, head, text, fileName);

            res.status(service.status).json(service);

            if (service.status == 201) {
                new Promise(() => {
                    setTimeout(() => {
                        fs.unlinkSync((`./${service.data}`));
                    }, 3000);
                });
            }
        }
    }

    async atualizar(req, res) {
        const { email } = req.params;
        const support = await registroSupport.atualizar(email, req.body);
        return res.status(support.status).json(support);
    }

    async modificar(req, res) {
        if (!req.body.novaSenha) {
            req.body.novaSenha = "";
        }

        const { email } = req.params;
        const fields = await registroField.modificar();
        let resultInputs = checkInputs(req.body, fields);
        let reqData = resultInputs.data;

        if (resultInputs.error == true) {
            return response(res, 400, true, resultInputs.message);
        }

        const data = { email: email, senha: reqData.senha };
        const support = await registroSupport.validar(data);

        if (support.status != 200) {
            return res.status(support.status).json(support);
        }

        return atualizar(reqData);

        async function atualizar(registro) {
            if (registro.email != email) {
                const client = await registroClient.buscar(reqData.email);
                if (client.status == 200) {
                    return response(res, 400, true, "Erro. Este E-mail já está sendo ultilizado.");
                }
                return modificar();
            }
            return modificar();
        };

        async function modificar() {
            if (reqData.novaSenha != "") {
                reqData.senha = reqData.novaSenha;
            };

            reqData.senha = await registroAssistence.createPassword(reqData.senha);
            delete reqData.novaSenha;

            const client = await registroClient.atualizar(reqData, email);
            return res.status(client.status).json(client);
        };
    }

    async deletar(req, res) {
        const { email } = req.params;
        const client = await registroClient.deletar(email);
        return res.status(client.status).json(client);
    }
}

module.exports = new registroController();