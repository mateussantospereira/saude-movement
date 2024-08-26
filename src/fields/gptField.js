class gptField {
    async quest() {
        return {
            quest: { nome: "Pergunta", max: 50, },
        };
    }
}

module.exports = new gptField();