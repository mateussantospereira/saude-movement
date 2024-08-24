const colaboradores = require("../utils/colaboradorUtil");
const relatorioUtil = require("../utils/relatorioUtil");
const registrosUtil = require("../utils/registrosUtil");
const registrosListarUtil = require("../utils/registrosListarUtil");
const tiposUtil = require("../utils/tiposUtil");
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
        const registros = await registrosListarUtil();
        const json = await colaboradores();
        renderizar(req, res, { body: 'inicio', table: json, registros: registros });
    }

    redirecionar(req, res) {
        res.redirect("/colaboradores");
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

    registrar(req, res) {
        renderizar(req, res, { body: 'registrar' });
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