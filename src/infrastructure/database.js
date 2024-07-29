const mysql = require("mysql");
const executeQuery = require("../helpers/executeQuery");
const config = require("./config");

class database {
    async init() {
        await this.createDatabase();
        await this.createTableRegistros();
        await this.createTableHistorico();
    }

    async createDatabase() {
        const database = config.name();
        const sql = `
            CREATE DATABASE IF NOT EXISTS ${database};
        `;

        const connection = mysql.createConnection(config.options());

        await new Promise((resolve, reject) => {
            connection.query(sql, (error) => {
                if (error) {
                    return reject(console.log("Erro ao tentar criar banco de dados: ", error));
                }

                return resolve(console.log("Banco de dados criado com êxito."));
            });
        });
    }

    async createTableRegistros() {
        const sql = `
            CREATE TABLE IF NOT EXISTS registros (
                id int auto_increment primary key,
                nome varchar(100) not null,
                email varchar(100) not null,
                senha varchar(100) not null,
                tipo varchar(25) not null,
                idade varchar(100),
                imc varchar(100),
                saude varchar(100),
                data date
            );
        `;

        return await this.createTable(sql, "Registros");
    }

    async createTableHistorico() {
        const sql = `
            CREATE TABLE IF NOT EXISTS historico (
                id int auto_increment primary key,
                nome varchar(100) not null,
                email varchar(100) not null,
                idade varchar(100) not null,
                imc varchar(100),
                saude varchar(100),
                data date
            );
        `;

        return await this.createTable(sql, "Histórico");
    }

    async createTable(sql, name) {
        try {
            await executeQuery(sql);
            return console.log(`Tabela ${name} criada com êxito.`);
        } catch (error) {
            return console.log("Erro ao criar tabela: ", error);
        }
    }
}

module.exports = new database;