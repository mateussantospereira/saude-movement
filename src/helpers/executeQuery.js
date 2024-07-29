const connection = require("../infrastructure/connection");

const executeQuery = async (sql, params = "") => {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (error, response) => {
            if (error) {
                return reject(error);
            }

            return resolve(response);
        });
    });
}

module.exports = executeQuery;