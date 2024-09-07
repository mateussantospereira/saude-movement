const executeQuery = require("../helpers/executeQuery");

class historicoModel {
    async listar(email) {
        const sql = "SELECT id, data, nome, idade, imc, saude FROM historico WHERE email = ? ORDER BY data DESC";
        return await executeQuery(sql, email);
    }

    async historicoPorSetor(setor) {
        const sql = "SELECT historico.email, historico.data, historico.idade, historico.imc, historico.saude FROM registros JOIN historico ON registros.email = historico.email WHERE setor = ? ORDER BY historico.data;";
        return await executeQuery(sql, setor);
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

    async truncar() {
        const sql = "TRUNCATE TABLE historico";
        return await executeQuery(sql);
    }
}

module.exports = new historicoModel();