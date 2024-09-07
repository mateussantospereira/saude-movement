const pdf = require("html-pdf");
const { url } = require("../config/urlCors")
const returnResponse = require("../helpers/returnResponse");
const historicoAssistence = require("../assistences/historicoAssistence");

class pdfService {
    async imprimir(data, options, head, text = "", fileName) {
        const html = await this.gerarHTML(data, head, text);

        return await this.gerarPDF(html, options, fileName);
    }

    async gerarHTML(data, head, text) {
        let lines = 20;
        let count = 0;
        let pages = "";
        let thead = `<thead>`;
        let date = await historicoAssistence.getDate();
        date = date.day;
        date = date.split("-");
        date = `${date[2]}/${date[1]}/${date[0]}`;
        let textDate = `
            <div id="date">
                <p>Data: ${date}<p>
            </div>
        `;

        Object.keys(head).forEach((i) => {
            thead = thead + `<th>${head[i]}</th>`;
        });

        thead = thead + `</thead>`;

        data = JSON.stringify(data);
        data = JSON.parse(data);

        data.forEach((report) => {
            if (count == 0) {
                pages = pages + `
                    <div class="page">
                        <div class="content">
                            ${text}
                            ${textDate}
                            <table>
                                ${thead}
                                <tbody>
                `;
            }

            if (count != 0 && count % lines == 0) {
                pages = pages + `
                    <div class="page">
                        <div class="content">
                            <table>
                                ${thead}
                                <tbody>
                `;
            }

            pages = pages + "<tr>";

            Object.keys(head).forEach((i) => {
                if (i == "data") {
                    let date = report[i].slice(0, 10).split("-");
                    report[i] = `${date[2]}/${date[1]}/${date[0]}`;
                }

                if (report[i]) {
                    pages = pages + `<td>${report[i]}</td>`;
                }
            })

            pages = pages + "</tr>";
            count++;

            if (count % lines == 0) {
                pages = pages + `
                                <tbody>
                            </table>
                        </div>
                    </div>
                `;
            }
        });

        if (count % lines != 0) {
            pages = pages + `
                            <tbody>
                        </table>
                    </div>
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
                    ${pages}
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