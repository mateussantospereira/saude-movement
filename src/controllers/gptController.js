const gptField = require("../fields/gptField");
const { checkInputs } = require("../helpers/checkInputs");
const gptService = require("../services/gptService");

class gptController {
    async query(req, res) {
        const fields = await gptField.quest();
        let resultInputs = checkInputs(req.body, fields);
        let reqData = resultInputs.data;

        if (resultInputs.error == true) {
            return response(res, 400, true, resultInputs.message);
        }

        const service = await gptService.query(reqData.query);
        return res.send(service);
    }
}

module.exports = new gptController();