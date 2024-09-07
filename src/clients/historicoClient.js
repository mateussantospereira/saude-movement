const historicoModel = require("../models/historicoModel");
const returnResponse = require("../helpers/returnResponse");
const xlsx = require("xlsx");
const fs = require("fs");

class historicoClient {
    async listar(email) {
        const model = historicoModel.listar(email);
        return model
            .then((historico) => {
                if (historico[0]) {
                    return returnResponse(200, false, "Histórico listado com êxito.", historico)
                } else {
                    return returnResponse(202, false, "Nenhuma gravação foi feita por esta pessoa.")
                }
            })
            .catch((error) => {
                console.log(error);
                return returnResponse(400, true, "Erro interno.")
            });
    }

    async historicoPorSetor(setor) {
        const model = historicoModel.historicoPorSetor(setor);
        return model
            .then((historico) => {
                if (historico[0]) {
                    return returnResponse(200, false, "Relatório listado com êxito.", historico)
                } else {
                    return returnResponse(202, false, "Nenhuma histórico encontrado.")
                }
            })
            .catch((error) => {
                console.log(error);
                return returnResponse(400, true, "Erro interno.")
            });
    }

    async gravar(data) {
        const model = historicoModel.gravar(data);
        return model
            .then(() => {
                return returnResponse(201, false, "Dados gravados no histórico com êxito.");
            })
            .catch((error) => {
                console.log(error);
                return returnResponse(400, true, "Erro interno.")
            });
    }

    async deletarAntigo(id) {
        const model = historicoModel.deletarAntigo(id);
        return model
            .then(() => {
                return returnResponse(201, false, `Registro de histórico deletado com êxito.`);
            })
            .catch((error) => {
                console.log(error);
                return returnResponse(400, true, "Erro interno.")
            });
    }

    async deletar(email) {
        const model = historicoModel.deletar(email);
        return model
            .then(() => {
                return returnResponse(201, false, `Histórico do colaborador ${ni} deletado com êxito.`);
            })
            .catch((error) => {
                console.log(error);
                return returnResponse(400, true, "Erro interno.")
            });
    }

    async truncar() {
        const model = historicoModel.truncar();
        return model
            .then(() => {
                return returnResponse(201, false, `Tabela truncada com êxito.`);
            })
            .catch((error) => {
                console.log(error);
                return returnResponse(400, true, "Erro interno.")
            });
    }
}

module.exports = new historicoClient();