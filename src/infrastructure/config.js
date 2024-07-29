class configDatabase {
    name() {
        return "db_saude_movement";
    }

    options() {
        return {
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD
        }
    }

    connection() {
        const connection = this.options();

        connection.database = this.name();

        return connection;
    }
}

module.exports = new configDatabase;