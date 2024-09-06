const colaboradores = require("../utils/colaboradorUtil");
const relatorioUtil = require("../utils/relatorioUtil");
const registrosUtil = require("../utils/registrosUtil");
const registrosListarUtil = require("../utils/registrosListarUtil");
const tiposUtil = require("../utils/tiposUtil");
const setoresUtil = require("../utils/setoresUtil");
const setorUtil = require("../utils/setorUtil");
const registroUtil = require("../utils/registroUtil");
const path = require("path");

const renderizar = (req, res, body) => {
    body.interface = body.interface || "main";

    if (req.session.sess) {
        body.userType = req.session.sess.userType;
    }
    
    res.render("index", { body: body });
}

class viewController {
    async inicio(req, res) {
        if (req.session.sess.userType == "colaborador") {
            let email = req.session.sess.email;
            let route = `/relatorio/${email}`;
            return res.redirect(route);
        }

        const registros = await registrosListarUtil();
        const json = await colaboradores();
        renderizar(req, res, { body: 'inicio', table: json, registros: registros });
    }

    redirecionar(req, res) {
        res.redirect("/inicio");
    }
    
    // ---------------------------------------------

    // Usuário

    validar(req, res) {
        renderizar(req, res, { body: 'validar', interface: "clean", out: false });
    }

    sair(req, res) {
        delete req.session.sess;
        renderizar(req, res, { body: 'validar', interface: "clean", out: true });
    }

    async registrar(req, res) {
        const setores = await setoresUtil();
        renderizar(req, res, { body: 'registrar', setores: setores });
    }

    async registros(req, res) {
        const json = await tiposUtil();
        renderizar(req, res, { body: 'registros', table: json });
    }

    async registrosTipo(req, res) {
        const { tipo } = req.params;
        const json = await registrosUtil(tipo);
        renderizar(req, res, { body: 'registros-tipo', table: json });
    }

    async importarRegistros(req, res) {
        renderizar(req, res, { body: 'importar-registros' });
    }

    async importarLista(req, res) {
        renderizar(req, res, { body: 'importar-lista' });
    }

    async importarHistorico(req, res) {
        renderizar(req, res, { body: 'importar-historico' });
    }


    async modificar(req, res) {
        const { email } = req.params;
        const json = await registroUtil(email);
        renderizar(req, res, { body: 'modificar', table: json });
    }

    // ---------------------------------------------

    // Colaboradores

    async setores(req, res) {
        const setores = await setoresUtil();
        renderizar(req, res, { body: 'setores', setores: setores });
    }

    async relatorioSetor(req, res) {
        const { setor } = req.params;
        const json = await setorUtil(setor);
        renderizar(req, res, { body: 'relatorio-setor', table: json });
    }

    async colaboradores(req, res) {
        const json = await colaboradores();
        renderizar(req, res, { body: 'colaboradores', table: json });
    }

    async relatorio(req, res) {
        const { email } = req.params;
        const json = await relatorioUtil(email);
        renderizar(req, res, { body: 'relatorio', table: json, email: email });
    }

    async imprimirLista(req, res) {
        const json = await colaboradores();
        renderizar(req, res, { body: 'imprimir-lista', table: json });
    }

    async exportarLista(req, res) {
        const json = await colaboradores();
        renderizar(req, res, { body: 'exportar-lista', table: json });
    }
    
    // ---------------------------------------------

    // Erro

    erro(req, res) {
        renderizar(req, res, { body: 'erro', interface: "clean" });
    }

    // ---------------------------------------------

    // Condições de uso

    uso(req, res) {
        renderizar(req, res, { body: 'uso' } );
    }

    read(req, res) {
        res.sendFile(path.join(__dirname, "../../README.md"))
    }
}

module.exports = new viewController();