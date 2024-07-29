class registroField {
    async validar() {
        return {
            email: { nome: "E-mail", max: 60 },
            senha: { nome: "Senha", max: 20 }
        };
    }

    async criar() {
        return {
            nome: { nome: "Nome", min: 10, max: 60, ndc: ["especiais", "numeros"] },
            email: { nome: "E-mail", min: 12, max: 60, obg: ["@", "."], ndc: ["especiais"] },
            senha: { nome: "Senha", min: 5, max: 20 },
            tipo: { nome: "Tipo", min: 3, max: 25 }
        };
    }

    async importar() {
        return {
            kilobyte: 150,
            fields: {
                'NOME': { nome: "Nome", min: 10, max: 60, ndc: ["especiais", "numeros"] },
                'E-MAIL': { nome: "E-mail", min: 12, max: 60, obg: ["@", "."], ndc: ["especiais"] },
                'SENHA': { nome: "Senha", min: 5, max: 20 },
                'TIPO': { nome: "Tipo", min: 3, max: 25 }
            }
        };
    }

    async imprimir() {
        return {
            inputs: {
                email: { nome: "E-mail", max: 60 }
            },
            list: { list: { nome: "Lista de impressão", max: 3000, list: true } },
            options: {
                "height": "29.7cm",
                "width": "21cm",
                "format": "Letter",
                "orientation": "portrait"
            }
        }
    }

    async atualizar() {
        return {
            imc: { nome: "IMC", min: 1, max: 4 },
            saude: { nome: "Saúde", min: 1, max: 3 }
        };
    }

    async modificar() {
        return {
            nome: { nome: "Nome", min: 10, max: 60, ndc: ["especiais", "numeros"] },
            email: { nome: "E-mail", min: 12, max: 60, obg: ["@", "."], ndc: ["especiais"] },
            senha: { nome: "Senha", max: 20 },
            novaSenha: { nome: "Nova senha", min: 5, max: 20, null: true }
        };
    }

    async tipos() {
        let adm = "adm".toLocaleLowerCase();
        let rh = "rh".toLocaleLowerCase();

        return { adm, rh, };
    }
}

module.exports = new registroField;