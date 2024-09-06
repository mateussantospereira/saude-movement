const { url } = require("../config/urlCors");

module.exports = async () => {
    const response = await fetch(`${url.local}/registro/listar-setores`);
    const json = await response.json();
    
    return json;
}