const fs = require("fs");

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
}

module.exports = new xlsxService;