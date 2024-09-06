const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const registroField = require("../fields/registroField");

class registroAssistence {
    async createSession(req, registro) {
        const expires = new Date(Date.now() + (60 * 60 * 1000)); // 60 * 60 * 1000 = 1 hora
        let type = await this.configType(registro);

        return req.session.sess = {
            userType: type,
            email: registro.email,
            path: '/', _expires: expires,
            originalMaxAge: expires,
            httpOnly: true
        };
    }

    async createToken(registro) {
        let type = await this.configType(registro);

        return jwt.sign(
            {
                session: true,
                nome: registro.nome,
                email: registro.email,
                tipo: type
            },
            process.env.SECRET,
            {
                expiresIn: 3600
            } // 3600 = 1 hora
        );
    }

    async createPassword(senha) {
        return await bcrypt.hash(senha, 8);
    }

    async configType(registro) {
        let type = "colaborador";

        if (registro.tipo == "Adm") {
            type = "adm";
        }

        if (registro.tipo == "RH") {
            type = "rh";
        }

        return type;
    }

    async formatClass(data) {
        const { rh, adm } = await registroField.tipos();

        let dataTipo = data.tipo.toLocaleLowerCase();

        if (dataTipo == adm) {
            data.tipo = "Adm";
            return data;
        }

        if (dataTipo == rh) {
            data.tipo = "RH";
            return data;
        }

        data.tipo = "Colaborador";
        return data;
    }
}

module.exports = new registroAssistence();