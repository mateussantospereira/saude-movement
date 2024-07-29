const pdf = require("html-pdf");
const { url } = require("../config/urlCors")
const returnResponse = require("../helpers/returnResponse");

class pdfService {
    async imprimir(data, options, fileName) {
        const html = await this.gerarHTML(data);

        return await this.gerarPDF(html, options, fileName);
    }

    async gerarHTML(data) {
        let lines = 5;
        let count = 0;
        let tables = "";
        let thead = `
            <thead>
                <th>Data</th>
                <th>Nome</th>
                <th>Idade</th>
                <th>Imc</th>
                <th>Saúde</th>
            </thead>
        `;

        data.forEach((report) => {
            if (count == 0 || count % lines == 0) {
                tables = tables + `
                    <div class="table">
                        <table>
                            ${thead}
                            <tbody>
                `;
            }

            tables = tables + "<tr>";

            Object.values(report).forEach((i) => {
                tables = tables + `<td>${i}</td>`;
            });

            tables = tables + "</tr>";
            count++;

            if (count % lines == 0) {
                tables = tables + `
                            <tbody>
                        </table>
                    </div>
                `;
            }
        });

        if (count % lines != 0) {
            tables = tables + `
                        <tbody>
                    </table>
                </div>
            `;
        }

        let html = `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link rel="stylesheet" href="${url.local}/public/css/pdf.css">
                    <title>Document</title>
                </head>
                <body>
                    ${tables}
                </body>
            </html>
        `;

        return html;
    }

    async gerarPDF(html, options, fileName) {
        return new Promise((resolve) => {
            pdf.create(html, options).toFile(
                `./public/pdf/${fileName}.pdf`, (error, file) => {
                    if (error) {
                        console.log(error)
                        return resolve(returnResponse(400, true, "Erro ao gerar arquivo."));
                    };

                    let filename = file["filename"];

                    if (filename.includes("\\")) {
                        filename = filename.split("\\").pop();
                    } else {
                        filename = filename.split("/").pop();
                    }

                    const url = `/public/pdf/${filename}`;

                    return resolve(returnResponse(201, false, "Arquivo gerado com êxito.", url));
                }
            );
        });
    }
}

module.exports = new pdfService();