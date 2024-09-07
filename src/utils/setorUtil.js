const { url } = require("../config/urlCors");

module.exports = async (setor) => {
    const response = await fetch(`${url.local}/registro/listar-setor/${setor}`);
    const json = await response.json();
    
    return json;
}