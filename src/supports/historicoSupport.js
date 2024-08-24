const historicoClient = require("../clients/historicoClient");
const historicoField = require("../fields/historicoField");
const registroSupport = require("../supports/registroSupport");
const returnResponse = require("../helpers/returnResponse");
const { checkInputs } = require("../helpers/checkInputs");
const historicoAssistence = require("../assistences/historicoAssistence");
const returnError = require("../helpers/returnError");
const registroClient = require("../clients/registroClient");

class historicoSupport {
    async gravar(body) {
        const fields = await historicoField.gravar();
        let resultInputs = checkInputs(body, fields);
        let reqData = resultInputs.data;

        if (resultInputs.error == true) {
            return response(res, 400, true, resultInputs.message);
        }

        const support = await registroSupport.lastUpdate(reqData.email);

        if (support.status != 200) {
            return response(res, 400, true, support.message);
        }

        const response = await this.deletarAntigo(email);

        if (response.status != 200) {
            return response(res, 400, true, response.message);
        }

        const date = await historicoAssistence.getDate();
        reqData.data = date.day;
        const client = await historicoClient.gravar(reqData);
        return client;
    }

    async valideXLSX(body, fields) {
        let list = [];

        for (let line of body) {
            let resultInputs = checkInputs(line, fields);
            let reqData = resultInputs.data;

            if (resultInputs.error == true) {
                return returnError(resultInputs.message);
            }

            const client = await registroClient.comparar(reqData['E-MAIL']);

            if (client.status != 200) {
                return returnError("Erro. O arquivo possuí E-mails não existentes no banco de dados.");
            }

            let newData = {
                data: reqData['DATA'],
                nome: client.data[0].nome,
                email: reqData['E-MAIL'],
                idade: reqData['IDADE'],
                imc: reqData['IMC'],
                saude: reqData['SAÚDE']
            };

            list.push(newData);
        }

        return returnResponse(200, false, "Arquivo validado.", list);
    }

    async deletarAntigo(email) {
        const client = await historicoClient.listar(email);

        if (client.status != 200) {
            return returnResponse(400, true, client.message);
        }

        const limit = await historicoField.limitReport();

        if (client.data.length <= limit) {
            return returnResponse(200, false, "Histórico normal.");
        }

        const expireds = client.data.slice(limit - client.data.length);

        expireds.forEach(async (report) => {
            const response = await historicoClient.deletarAntigo(report.id);
        });

        return returnResponse(200, false, "Histórico configurado.");
    }
}

module.exports = new historicoSupport();