const Response = require('../../../configuration/config.response');
bcrypt = require('bcrypt'),
    { PrismaClient } = require('@prisma/client'),
    Prisma = new PrismaClient(),
    { sendEmail } = require("../../../configuration/config.mailer");
const jwt = require("jsonwebtoken");

const adminController = async (req, res, next) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next({ msg: 100 });
        }
        console.log(req.body)
        const userWithEmail = await Prisma.admin.findFirst({ where: { email } });
        console.log("first",userWithEmail)

        if (!userWithEmail) {
            return next({ msg: 101});
        }


        let isPasswordMatched = await bcrypt.compare(password, userWithEmail.password);

        if (!isPasswordMatched) {
            return next({ msg: 102});
        }

        const jwtToken = jwt.sign(
            { id: userWithEmail.id, user: userWithEmail },
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

const adminProfile = async (req, res, next) => {
    try {
        return Response.sendResponse(
            res, {
            msg: '406',
            data: {
                user: req.user,
            },
            lang: req.params.lang
        });
    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });

    }
}

const sendSubscribeEmail = async (req, res, next) => {
    try {

        let subscription = await Prisma.Subscription.findFirst({
            where: {
                email: req.body.email
            }
        })
        if(subscription){
            subscription = await Prisma.Subscription.update({
                where: {
                    id: subscription.id
                },
                data: {
                    status : 1
                }
            })
        }else{
            subscription = await Prisma.Subscription.create({
                data: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    phone: req.body.phone
                }
            })
        }
        sendEmail(null,null,req.body.email,"subscribe",
            {
                backendAssetsUrl: config.backendAssetsUrl,
                customer: req.body
            },
            "Thank you for subscribing with us!"
        )
        return Response.sendResponse(
            res, {
            msg: '515',
            data: {
                customer: subscription
            },
            lang: req.params.lang
        });


    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });
    }
}

const sendContactUsEmail = async (req, res, next) => {
    try {

        let contactUs = await Prisma.ContactUs.findFirst({
            where: {
                email: req.body.email,
                phone: req.body.phone
            }
        })
        if(!contactUs){
            contactUs = await Prisma.ContactUs.create({
                data: {
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    message: req.body.message
                }
            })
        }
        sendEmail(null,null,req.body.email,"contactus",
            {
                backendAssetsUrl: config.backendAssetsUrl,
                customer: req.body
            },
            "Thank you for contacting us!"
        )
        return Response.sendResponse(
            res, {
            msg: '515',
            data: {
                customer: contactUs
            },
            lang: req.params.lang
        });


    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });
    }
}

module.exports = {
    adminController,
    adminProfile,
    sendSubscribeEmail,
    sendContactUsEmail
};