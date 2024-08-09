const fs = require("fs");
const xlsx = require("xlsx");
const returnResponse = require("../helpers/returnResponse");

class xlsxService {
    async createImportedFile(req, limit, fileName) {
        let data = [];
        const kilobyte = limit;
        const byte = kilobyte * 1000;
        const file = fs.createWriteStream(`./public/xlsx/import/${fileName}`);

        return new Promise((resolve) => {
            req.on("data", chunk => {
                data.push(chunk);
            });
            req.on("end", () => {
                data = Buffer.concat(data);

                if (data.length > byte) {
                    file.end();
                    return resolve(returnResponse(400, true,
                        `Erro. Este arquivo supera o limite de tamanho (${kilobyte} KB).`));
                }

                file.write(data);
                file.end("end", (error) => {
                    if (error) {
                        return resolve(returnResponse(400, true,
                            "Erro ao criar arquivo XLSX."));
                    }

                    const file = xlsx.readFile(`./public/xlsx/import/${fileName}`);
                    const temp = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);

                    return resolve(returnResponse(201, false,
                        "Arquivo XLSX criado com êxito.", temp));
                });
            });
        });
    }

    async exportar(data, head, fileName) {
        data = JSON.stringify(data);
        data = JSON.parse(data);

        try {
            const keys = Object.keys(data[0]);

            data.forEach((p) => {
                keys.forEach((key) => {
                    if (key == "data") {
                        let date = p[key].slice(0, 10).split("-");
                        p[key] = `${date[2]}/${date[1]}/${date[0]}`;
                    }
                    if (!head[key]) {
                        delete p[key];
                    } else {
                        delete Object.assign(p, { [head[key]]: p[key] })[key];
                    };
                });
            });

            const worksheet = xlsx.utils.json_to_sheet(data);
            const workbook = xlsx.utils.book_new();

            xlsx.utils.book_append_sheet(workbook, worksheet, "Dados dos Colaboradores");
            await xlsx.writeFile(workbook, `./public/xlsx/export/${fileName}.xlsx`);

            const url = `/public/xlsx/export/${fileName}.xlsx`;

            return returnResponse(201, false, "Arquivo XLSX criado com êxito.", url);
        } catch (error) {
            return returnResponse(400, true, "Erro ao tentar criar arquivo XLSX.")
        }
    }
}

module.exports = new xlsxService;