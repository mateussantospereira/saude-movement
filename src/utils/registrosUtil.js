const { url } = require("../config/urlCors");

module.exports = async (tipo) => {
    const response = await fetch(`${url.local}/registro/listar-tipo/${tipo}`);
    const json = await response.json();

    if (json["data"]) {
        json["data"].forEach((line) => {
            line["modificacao"] = {
                href: `/modificar/${line["email"]}`,
                text: "Modificar"
            };

            Object.keys(line).forEach((key) => {
                if (line[key] == null) {
                    delete line[key];
                }
            })
        });
    }
    
    return json;
}