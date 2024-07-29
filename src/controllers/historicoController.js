const historicoClient = require("../clients/historicoClient");
const historicoSupport = require("../supports/historicoSupport");

class historicoController {
    async listar(req, res) {
        const { email } = req.params;
        const client = await historicoClient.listar(email);
        return res.status(client.status).json(client);
    }

    async gravar(req, res) {
        const support = await historicoSupport.gravar(req.body);
        return res.status(support.status).json(support);
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