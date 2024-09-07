class historicoField {
    async gravar() {
        return {
            ni: { nome: "Número de inventário", max: 16, number_text: true },
            periodo: { nome: "Período", min: 1, max: 20 },
            autor: { nome: "Autor", min: 1, max: 60 },
            turma: { nome: "Turma", min: 3, max: 30 },
            email: { nome: "E-mail", min: 1, max: 60 }
        };
    }

    async importar() {
        return {
            kilobyte: 150,
            fields: {
                'DATA': { nome: "Data", max: 10, date: "formatar" },
                'E-MAIL': { nome: "E-mail", min: 12, max: 60, obg: ["@", "."], ndc: ["especiais"] },
                'IDADE': { nome: "Idade", max: 5 },
                'IMC': { nome: "IMC", max: 5 },
                'SAÚDE': { nome: "Saúde", max: 5 }
            }
        };
    }

    async limitReport() {
        return 15;
    }
}

module.exports = new historicoField();