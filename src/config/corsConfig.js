const cors = require("cors");
const { urlCors } = require("./urlCors");
const corsConfig = cors({ origin: urlCors, methods: "GET,POST,PUT,DELETE" });

module.exports = corsConfig;