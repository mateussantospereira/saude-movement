const registroClient = require("../clients/registroClient");
const registroAssistence = require("../assistences/registroAssistence");
const returnResponse = require("../helpers/returnResponse");
const returnError = require("../helpers/returnError");
const registroField = require("../fields/registroField");
const { checkInputs } = require("../helpers/checkInputs");
const bcrypt = require("bcryptjs");
const historicoAssistence = require("../assistences/historicoAssistence");

class registroSupport {
    async validar(data) {
        const client = await registroClient.comparar(data.email);

        if (client.status != 200) {
            return returnResponse(400, true, "Erro. E-mail ou senha incorretos.");
        }

        const registro = client.data[0];

        if ((await bcrypt.compare(data.senha, registro.senha))) {
            return returnResponse(200, false, "Validação concluída com êxito.", registro);
        } else {
            return returnResponse(400, true, "Erro. E-mail ou senha incorretos.");
        }
    }

    async criar(data) {
        const fields = await registroField.criar();
        let resultInputs = checkInputs(data, fields);
        let reqData = resultInputs.data;

        if (resultInputs.error == true) {
            return returnResponse(400, true, resultInputs.message);
        }

        reqData.senha = await registroAssistence.createPassword(reqData.senha);
        return buscar(reqData.email);

        async function buscar(email) {
            const client = await registroClient.comparar(email);

            if (client.status == 200) {
                return returnResponse(400, true, "Erro. Este E-mail já está em uso.");
            }

            return criar(reqData);
        }

        async function criar(data) {
            data = await registroAssistence.formatClass(data);
            const response = await registroClient.criar(data);
            return response;
        }
    }

    async valideXLSX(body, fields) {
        let list = [];
        let listaEmail = [];

        for (let line of body) {
            let resultInputs = checkInputs(line, fields);
            let reqData = resultInputs.data;

            if (resultInputs.error == true) {
                return returnError(resultInputs.message);
            }

            if (listaEmail.includes(reqData['E-MAIL'])) {
                return returnError("Erro. Este arquivo possuí E-mails repetidos.");
            }

            const client = await registroClient.comparar(reqData['E-MAIL']);

            if (client.status == 200) {
                return returnError("Erro. O arquivo possuí E-mails já existentes no banco de dados.");
            }

            listaEmail.push(reqData['E-MAIL']);

            let newData = {
                nome: reqData['NOME'],
                email: reqData['E-MAIL'],
                senha: reqData['SENHA'],
                tipo: reqData['TIPO']
            };

            newData = await registroAssistence.formatClass(newData);

            list.push(newData);
        }

        return returnResponse(200, false, "Arquivo validado.", list);
    }

    async valideList(body, fields) {
        let list = [];
        let resultInputs = checkInputs(body, fields);
        let reqData = resultInputs.data;

        if (resultInputs.error == true) {
            return returnResponse(400, true, resultInputs.message);
        } else {
            return await verificar(reqData.list);
            
        }

        async function verificar(data) {
            for (let email of data) {
                const client = await registroClient.buscar(email);
                if (client.status != 200) {
                    return returnResponse(400, true, "Erro. Alguns patrimônios não foram cadastrados.");
                } else {
                    list.push(client.data[0]);
                }
            }

            return returnResponse(200, false, "Lista validada.", list);
        }
    }

    async lastUpdate(email) {
        const date = await colaboradorAssistance.getDate();
        const client = await colaboradorClient.buscar(email);

        if (client.status != 200) {
            return returnResponse(400, true, client.message);
        }

        if (client.data[0].data != undefined) {
            let data = client.data[0].data;
            data = JSON.stringify(data);
            data = JSON.parse(data);
            data = data.slice(0, 10);

            if (data == date.day) {
                return returnResponse(400, true, "Informações já atualizadas hoje.");
            }
        }

        return returnResponse(200, true, "Nenhuma manutenção hoje.");
    }

    async atualizar(email, body) {
        const support = await this.lastUpdate(email);

        if (support.status != 200) {
            return returnResponse(400, true, support.message);
        }

        const fields = await registroField.atualizar();
        let resultInputs = checkInputs(body, fields);
        let reqData = resultInputs.data;

        if (resultInputs.error == true) {
            return returnResponse(400, true, resultInputs.message);
        }

        const date = await historicoAssistence.getDate();
        reqData.data = date.day;

        return atualizar(reqData);

        async function atualizar(info) {
            const response = await registroClient.atualizar(info, email);
            return response;
        };
    }
}

module.exports = new registroSupport;