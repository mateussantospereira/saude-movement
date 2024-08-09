const fs = require("fs");
const { response } = require("./response");

const deleteFile = (res, fileName, status, error, message) => {
    fs.unlinkSync(`./public/xlsx/import/${fileName}`);
    return response(res, status, error, message);
};

module.exports = deleteFile;