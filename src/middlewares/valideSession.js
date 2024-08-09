const validePage = require("./validePage");
const { checkInputs } = require("../helpers/checkInputs");
const { response } = require("../helpers/response");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

// Validação local e externa

async function verificarToken (req, res, next, type = "colaborador") {
    const fields = { token: { nome: "Token", max: 300 } };

    let resultInputs = checkInputs({ token: req.body.token }, fields);

    if (resultInputs.error == true) {
        response(res, 400, true, resultInputs.message);
        return;
    }

    let token = resultInputs.data.token;

    try {
        const decode = await promisify(jwt.verify)(token, process.env.SECRET);

        if (decode.tipo == "adm") {
            return next();
        }

        if (type == "rh" && decode.tipo == "rh") {
            return next();
        }
        
        if (
            type == "colaborador" && decode.tipo == "colaborador" ||
            type == "colaborador" && decode.tipo == "rh"
        ) {
            return next();
        }

        return response(res, 400, true, "Acesso não autorizado.");

    } catch (error) {
        return response(res, 400, true, "Token inválido");
    }
};

class valideSession {
    async colaborador(req, res, next) {
        if (req.body.token) {
            return await verificarToken(req, res, next);
        }
    
        return validePage.colaborador(req, res, next);
    };

    async rh(req, res, next) {
        if (req.body.token) {
            return await verificarToken(req, res, next, "rh");
        }

        return validePage.rh(req, res, next);
    };

    async adm(req, res, next) {
        if (req.body.token) {
            return await verificarToken(req, res, next, "adm");
        }
        
        return validePage.adm(req, res, next);
    };
}

module.exports = new valideSession();