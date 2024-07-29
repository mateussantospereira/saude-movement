const { url } = require("../config/urlCors");

module.exports = async (email) => {
    const response = await fetch(`${url.local}/historico/listar/${email}`);
    const json = await response.json();

    if (json["data"]) {
        json.data.forEach((line) => {
            let data = line.data.slice(0, 10);
            data = data.split("-")
            data = `${data[2]}/${data[1]}/${data[0]}`;
            line.data = data;
        });
    }
    
    return json;
}