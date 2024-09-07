const { url } = require("../config/urlCors");

module.exports = async (setor) => {
    const response = await fetch(`${url.local}/historico/setor/${setor}`);
    const json = await response.json();

    let dates = [];

    if (json.status == 200) {
        let data = {};

        json.data.forEach((i) => {
            i.data = i.data.slice(0, 10);

            if (Number(i.imc)) {
                if (!data[i.data]) {
                    data[i.data] = {
                        total: 0,
                        quant: 0,
                    }
                }

                data[i.data].total = data[i.data].total + Number(i.imc);
                data[i.data].quant++;
            }
        });

        Object.keys(data).forEach((k) => {
            data[k].media = data[k].total / data[k].quant;
            data[k].media = data[k].media - (data[k].media % 0.01);

            let date = k.split("-");
            date = `${date[2]}/${date[1]}/${date[0].slice(2, 4)}`;

            dates.push({ data: date, media: data[k].media });
        });
    }

    json.data = dates;

    return json;
}