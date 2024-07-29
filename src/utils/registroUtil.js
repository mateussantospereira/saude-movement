const { url } = require("../config/urlCors");

module.exports = async (email) => {
    const response = await fetch(`${url.local}/registro/buscar/${email}`);
    const json = await response.json();
    
    return json;
}