const routes = require("./routes");
const viewController = require("../controllers/viewController");
const cacheScheduler = require("../caches/rateLimiter/cacheScheduler");
const path = require("path");
const session = require("express-session");
const corsConfig = require("../config/corsConfig");
const { error } = require("../middlewares/error");

module.exports = async (app, express) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(corsConfig);
    cacheScheduler();
    app.use("/public", express.static(path.join(__dirname, "../../public")));
    app.set('views', path.join(__dirname, '../views'));
    app.set("view engine", "ejs");
    app.use(session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true
    }));
    app.use('/', routes);
    app.use(viewController.erro);
    app.use(error);
}