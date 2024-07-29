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

    async limitReport() {
        return 6;
    }
}

module.exports = new historicoField();