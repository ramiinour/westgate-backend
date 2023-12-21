const Response = require('../../../configuration/config.response');
bcrypt = require('bcrypt'),
    { PrismaClient } = require('@prisma/client'),
    Prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

const loginController = async (req, res, next) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next({ msg: 100 });
        }
        const userWithEmail = await Prisma.User.findFirst({ where: { email } });

        if (!userWithEmail) {
            return next({ msg: 102});
        }


        let isPasswordMatched = await bcrypt.compare(password, userWithEmail.password);

        if (!isPasswordMatched) {
            return next({ msg: 102});
        }

        const jwtToken = jwt.sign(
            { id: userWithEmail.id, email: userWithEmail.email },
            config.jwtSetting.secret
        );


        delete userWithEmail.password;
        return Response.sendResponse(
            res, {
            msg: '305',
            data: {
                token: jwtToken,
                user: userWithEmail
            },
            lang: req.params.lang
        });

    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });
    }

}

module.exports = {
    loginController
};