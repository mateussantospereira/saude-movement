const executeQuery = require("../helpers/executeQuery");

class historicoModel {
    async listar(email) {
        const sql = "SELECT data, nome, idade, imc, saude FROM historico WHERE email = ? ORDER BY data DESC;";
        return await executeQuery(sql, email);
    }

    async gravar(data) {
        const sql = "INSERT INTO historico SET ?";
        return await executeQuery(sql, data);
    }

    async deletarAntigo(id) {
        const sql = "DELETE FROM historico WHERE id = ?";
        return await executeQuery(sql, id);
    }

    async deletar(email) {
        const sql = "DELETE FROM historico WHERE email = ?";
        return await executeQuery(sql, email);
    }
}

module.exports = new historicoModel();