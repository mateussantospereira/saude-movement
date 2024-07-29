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

// Usuário
router.get("/", viewController.inicio);
router.get("/sair", viewController.sair);
router.get("/validar", resolver(viewController.validar));
router.get("/registrar", resolver(viewController.registrar));
router.get("/registros", validePage.rh, resolver(viewController.registros));
router.get("/registros/:tipo", resolver(viewController.registrosTipo));
router.get("/modificar/:email", resolver(viewController.modificar));

// Colaboradores
router.get("/colaboradores", validePage.rh, resolver(viewController.colaboradores));
router.get("/relatorio/:email", resolver(viewController.relatorio));
router.get("/imprimir-lista", resolver(viewController.imprimirLista));

// Registro Controller

router.get("/registro/listar", registroController.listar);
router.get("/registro/listar-tipo/:tipo", registroController.listarPorTipo);
router.get("/registro/listar-tipos", registroController.listarTipos);
router.get("/registro/buscar/:email", registroController.buscar);
router.post("/registro/validar", registroController.validar);
router.post("/registro/criar", valideSession.adm, registroController.criar);
router.post("/registro/importar", valideSession.adm, registroController.importar);
router.post("/registro/imprimir-relatorio/:email", valideSession.rh, rateLimiter, registroController.imprimirRelatorio);
router.post("/registro/imprimir-lista", valideSession.rh, rateLimiter, registroController.imprimirLista);
router.put("/registro/atualizar/:email", valideSession.adm, rateLimiter, registroController.atualizar);
router.put("/registro/modificar/:email", valideSession.adm, rateLimiter, registroController.modificar);
router.delete("/registro/deletar/:email", valideSession.adm, rateLimiter, registroController.deletar);

// Histórico Controller

router.get("/historico/listar/:email", historicoController.listar);
router.delete("/historico/deletar-antigo/:email", rateLimiter, historicoController.deletarAntigo);

module.exports = router;