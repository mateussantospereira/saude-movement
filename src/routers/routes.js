const { Router } = require("express");
const registroController = require("../controllers/registroController");
const viewController = require("../controllers/viewController")
const rateLimiter = require("../middlewares/rateLimiter");
const validePage = require("../middlewares/validePage");
const valideSession = require("../middlewares/valideSession");
const { resolver } = require("../middlewares/error");
const historicoController = require("../controllers/historicoController");
const router = Router();

// Páginas EJS

router.get("/inicio", validePage.colaborador, resolver(viewController.inicio));

// Usuário
router.get("/", viewController.redirecionar);
router.get("/sair", viewController.sair);
router.get("/validar", resolver(viewController.validar));
router.get("/registrar", validePage.adm, resolver(viewController.registrar));
router.get("/registros", validePage.adm, resolver(viewController.registros));
router.get("/registros/:tipo", validePage.adm, resolver(viewController.registrosTipo));
router.get("/modificar/:email", validePage.adm, resolver(viewController.modificar));

// Condições de uso
router.get("/uso", resolver(viewController.uso));

// ReadME.md
router.get("/read", resolver(viewController.read));

// Colaboradores
router.get("/setores", validePage.rh, resolver(viewController.setores));
router.get("/colaboradores", validePage.rh, resolver(viewController.colaboradores));
router.get("/relatorio-setor/:setor", validePage.rh, resolver(viewController.relatorioSetor));
router.get("/relatorio/:email", validePage.colaborador, resolver(viewController.relatorio));
router.get("/imprimir-lista", validePage.rh, resolver(viewController.imprimirLista));
router.get("/importar-registros", validePage.adm, resolver(viewController.importarRegistros));
router.get("/importar-lista", validePage.adm, resolver(viewController.importarLista));
router.get("/importar-historico", validePage.adm, resolver(viewController.importarHistorico));
router.get("/exportar-lista", validePage.rh, resolver(viewController.exportarLista));

// Registro Controller

router.get("/registro/listar", registroController.listar);
router.get("/registro/listar-tipo/:tipo", registroController.listarPorTipo);
router.get("/registro/listar-setor/:setor", registroController.listarPorSetor);
router.get("/registro/listar-tipos", registroController.listarTipos);
router.get("/registro/listar-setores", registroController.listarSetores);
router.get("/registro/buscar/:email", registroController.buscar);
router.post("/registro/validar", registroController.validar);
router.post("/registro/criar", valideSession.adm, registroController.criar);
router.post("/registro/importar", valideSession.adm, registroController.importar);
router.post("/registro/importar-atualizacao", valideSession.adm, registroController.importarAtualizacao);
router.post("/registro/exportar-lista", valideSession.rh, registroController.exportar);
router.post("/registro/imprimir-relatorio/:email", valideSession.colaborador, rateLimiter, registroController.imprimirRelatorio);
router.post("/registro/imprimir-lista", valideSession.rh, rateLimiter, registroController.imprimirLista);
router.put("/registro/atualizar/:email", valideSession.adm, rateLimiter, registroController.atualizar);
router.put("/registro/modificar/:email", valideSession.adm, rateLimiter, registroController.modificar);
router.delete("/registro/deletar-tipo/:tipo", valideSession.adm, rateLimiter, registroController.deletarTipo);
router.delete("/registro/deletar/:email", valideSession.adm, rateLimiter, registroController.deletar);

// Histórico Controller

router.get("/historico/listar/:email", historicoController.listar);
router.get("/historico/setor/:setor", historicoController.historicoPorSetor);
router.post("/historico/importar", historicoController.importar);
router.delete("/historico/deletar-antigo/:email", rateLimiter, historicoController.deletarAntigo);

module.exports = router;