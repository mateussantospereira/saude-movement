const { url } = require("../config/urlCors");

module.exports = async () => {
    const response = await fetch(`${url.local}/registro/listar-tipos`);
    const json = await response.json();

    if (json["data"]) {
        json["data"].forEach((p) => {
            p["registro"] = {
                href: `/registros/${p["tipo"]}`,
                text: "Vizualizar"
            };
        });
    }

    return json;
}