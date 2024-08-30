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
            tipo: { nome: "Tipo", min: 2, max: 25 }
        };
    }

    async importar() {
        return {
            kilobyte: 150,
            fields: {
                'NOME': { nome: "Nome", min: 10, max: 60, ndc: ["especiais", "numeros"] },
                'E-MAIL': { nome: "E-mail", min: 12, max: 60, obg: ["@", "."], ndc: ["especiais"] },
                'SENHA': { nome: "Senha", min: 5, max: 20 },
                'TIPO': { nome: "Tipo", min: 2, max: 25 }
            }
        };
    }

    async importarAtualizacao() {
        return {
            kilobyte: 150,
            fields: {
                'E-MAIL': { nome: "E-mail", min: 12, max: 60 },
                'IDADE': { nome: "Idade", max: 5 },
                'IMC': { nome: "IMC", max: 5 },
                'SAÚDE': { nome: "Saúde", max: 5 }
            }
        };
    }

    async exportar() {
        return {
            list: { list: { nome: "Lista de exportação", max: 3000, list: true } },
            head: {
                nome: ['NOME'],
                email: ['E-MAIL'],
                idade: ['IDADE'],
                imc: ['IMC'],
                saude: ['SAÚDE']
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
            },
            head: {
                data: "Data",
                nome: "Nome",
                email: "E-mail",
                idade: "Idade",
                imc: "IMC",
                saude: "Saúde"
            },
            textList: `
                <div class="text">
                    <h3>Relátorio de colaboradores</h3>
                    <p>Este é o relatório de saúde dos colaboradores da empresa.</p>
                </div>
            `
        }
    }

    async atualizar() {
        return {
            idade: { nome: "Idade", min: 1, max: 5 },
            imc: { nome: "IMC", min: 1, max: 5 },
            saude: { nome: "Saúde", min: 1, max: 5 }
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