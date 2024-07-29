const colaboradorModel = require("../models/colaboradorModel");
const returnResponse = require("../helpers/returnResponse");

class colaboradorClient {
    async listar() {
        const model = colaboradorModel.listar();
        return model
            .then((colaboradors) => {
                if (colaboradors[0]) {
                    return returnResponse(200, false, "Colaboradores listados com êxito.", colaboradors);
                } else {
                    return returnResponse(202, false, "Nenhum colaborador existente.");
                }
            })
            .catch(() => { return returnResponse(400, true, "Erro interno.") });
    }

    async buscar(email) {
        const model = colaboradorModel.buscar(email);
        return model
            .then((colaborador) => {
                if (colaborador[0]) {
                    return returnResponse(200, false, "Colaborador buscado com êxito.", colaborador);
                } else {
                    return returnResponse(404, true, "Colaborador inexistente.");
                }
            })
            .catch(() => { 
                return returnResponse(400, true, "Erro interno.") 
            });
    }

    async comparar(email) {
        const model = colaboradorModel.comparar(email);
        return model
            .then((colaborador) => {
                if (colaborador[0]) {
                    return returnResponse(200, false, "Colaborador buscado com êxito.", colaborador);
                } else {
                    return returnResponse(404, true, "Colaborador inexistente.");
                }
            })
            .catch(() => { return returnResponse(400, true, "Erro interno.") });
    }

    async criar(data) {
        const model = colaboradorModel.criar(data);
        return model
            .then(() => {
                return returnResponse(201, false, "Agente registrado com sucesso.");
            })
            .catch(() => {
                return returnResponse(400, true, "Erro interno.");
            });
    }

    async atualizar(data, email) {
        const model = colaboradorModel.atualizar(data, email);
        return model
            .then(() => {
                return returnResponse(200, false, "Colaborador modificado com êxito.");
            })
            .catch(() => {
                return returnResponse(400, true, "Erro interno.");
            });
    }

    async deletar(email) {        
        const model = colaboradorModel.deletar(email);
        return model
            .then(() => {
                return returnResponse(200, false, "Colaborador deletado com êxito.");
            })
            .catch(() => {
                return returnResponse(400, true, "Erro interno.");
            });
    }
}

module.exports = new colaboradorClient();