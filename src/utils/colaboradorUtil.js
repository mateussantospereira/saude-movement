const { url } = require("../config/urlCors");

module.exports = async () => {
    const response = await fetch(`${url.local}/registro/listar-tipo/colaborador`);
    const json = await response.json();

    if (json["data"]) {
        json["data"].forEach((p) => {
            p["relatorio"] = {
                href: `/relatorio/${p["email"]}`,
                text: "Vizualizar"
            };
        });
    }
    
    return json;
}