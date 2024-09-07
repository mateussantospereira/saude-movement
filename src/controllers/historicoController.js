const historicoClient = require("../clients/historicoClient");
const historicoField = require("../fields/historicoField");
const xlsxService = require("../services/xlsxService");
const historicoSupport = require("../supports/historicoSupport");
const deleteFile = require("../helpers/deleteImportedFile");

class historicoController {
    async listar(req, res) {
        const { email } = req.params;
        const client = await historicoClient.listar(email);
        return res.status(client.status).json(client);
    }

    async historicoPorSetor(req, res) {
        const { setor } = req.params;
        const client = await historicoClient.historicoPorSetor(setor);
        return res.status(client.status).json(client);
    }

    async gravar(req, res) {
        const support = await historicoSupport.gravar(req.body);
        return res.status(support.status).json(support);
    }

    async importar(req, res) {
        const fileName = `${Date.now()}${req["sessionID"]}`;
        const importarField = await historicoField.importar();
        const kilobyte = importarField.kilobyte;

        const service = await xlsxService.createImportedFile(req, kilobyte, fileName);

        if (service.status != 201) {
            return deleteFile(res, fileName, 400, true, service.message);
        }

        return await readXLSX();

        async function readXLSX() {
            async function readFile() {
                const fields = importarField.fields;
                const support = await historicoSupport.valideXLSX(service.data, fields);

                if (support.status != 200) {
                    return deleteFile(res, fileName, 400, true, support.message);
                }

                return registrar(support.data);

                async function registrar(data) {
                    for (let line of data) {
                        const registro = await historicoClient.gravar(line)

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
                return deleteFile(res, fileName, 
                    400, true, "Erro ao ler arquivo. Envie um arquivo XLSX válido.");
            }
        }
    }

    async deletarAntigo(req, res) {
        const { email } = req.params;
        const support = await historicoSupport.deletarAntigo(email);
        return res.status(support.status).json(support);
    }

    async deletar(req, res) {
        const { email } = req.params;
        const client = await historicoClient.deletar(email);
        return res.status(client.status).json(client);
    }
}

module.exports = new historicoController();