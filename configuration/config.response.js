
const successMessages = require('./config.success'),
    sendResponse = (res, data) => {

        console.log('data.msg', data.msg);
        const Response = successMessages[data.msg].msg[global.config.languagesAllowed[data.lang]] || '';

        let responseToSend = {
            response: 200,
            success: 1,
            message: Response,
            data: data.data || {}
        };
        res.json(responseToSend);
    };

module.exports = {
    sendResponse,
};