const executeQuery = require("../helpers/executeQuery");

class RegistroModel {
    async listar() {
        const sql = "SELECT * FROM registros";
        return await executeQuery(sql);
    }

    async listarPorTipo(tipo) {
        const sql = "SELECT * FROM registros WHERE tipo = ?";
        return await executeQuery(sql, tipo);
    }

    async listarTipos() {
        const sql = "SELECT tipo, count(*) FROM registros GROUP BY tipo;";
        return await executeQuery(sql);
    }

    async buscar(email) {
        const sql = "SELECT nome, tipo, email FROM registros WHERE email = ?";
        return await executeQuery(sql, email);
    }

    async comparar(email) {
        const sql = "SELECT * FROM registros WHERE email = ?";
        return await executeQuery(sql, email);
    }

    async criar(registro) {
        const sql = "INSERT INTO registros SET ?";
        return await executeQuery(sql, registro);
    }

    async atualizar(data, email) {    
        const sql = "UPDATE registros SET ? WHERE email = ?";
        return await executeQuery(sql, [data, email]);
    }

    async deletar(email) {
        const sql = "DELETE FROM registros WHERE email = ?";
        return await executeQuery(sql, email);
    }
}

module.exports = new RegistroModel();