const returnResponse = require("./returnResponse");

const returnError = (message) => {
    return returnResponse(400, true, message);
}

module.exports = returnError;