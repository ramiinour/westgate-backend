
const Response = require('../../../configuration/config.response'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    { PrismaClient } = require('@prisma/client'),
    Prisma = new PrismaClient();

const createUserController = async (req, res, next) => {
    try {

        if (!req.body.email || !req.body.password) {
            return next({ msg: 100 });
        }


        const exist = await Prisma.User.findFirst({
            where: {
                email: req.body.email
            }
        })

        if(exist) {
            return next({ msg: 104});
        }

        const saltRounds = 10,
            plainPassword = req.body.password;

        const password = await bcrypt.hash(plainPassword, saltRounds);

        const user = {
            data: {
                name: req.body.name || null,
                email: req.body.email,
                password: password,
                token: ''
            }
        };

        const created_user = await Prisma.User.create(user);

        const jwtToken = jwt.sign(
            { id: created_user.id, email: created_user.email },
            config.jwtSetting.secret
        );

        const update_user = await Prisma.User.update({
            where: {
                id: created_user.id,
            },
            data: {
                token: jwtToken
            }
        })
        delete created_user.password
        return Response.sendResponse(
            res, {
            msg: '300',
            data: {
                token: jwtToken,
                user: created_user
            },
            lang: req.params.lang
        });

    } catch (err) {
        console.log(err);
        return next({ msg: 101 });
    }
}

const findUserWithToken = async (req, res, next) => {
    try {
        const { logintoken } = req.headers;
        console.log(req.headers);

        const user = await Prisma.User.findFirst({
            where: {
                token: logintoken
            }
        })

        if(!user) {
            return next({ msg: 103, code: 404 });
        }

        return Response.sendResponse(
            res, {
            msg: '306',
            data: {
                user: user,
            },
            lang: req.params.lang
        });

    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });
    }
}
//Get One User
// // dark choc, anar, with bench. dates, badam, kaddu ki seeds
const findOneUserController = async (req, res, next) => {
    const selector = {
        where: {
            id: parseInt(req.params.id),
        }
    };
    const foundUser = await Prisma.User.findFirst(selector);
    try {
        return Response.sendResponse(
            res,
            {
                msg: '303',
                data: {
                    data: foundUser,
                },
                lang: req.params.lang
            });

    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });
    }
}

//Find All Users
const findAllUserController = async (req, res, next) => {
    try {

        const all_user = await Prisma.User.findMany({});
        return Response.sendResponse(
            res, {
            msg: '304',
            data: {
                user: all_user,
            },
            lang: req.params.lang
        });

    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });
    }
}
// //Update user

const updateUserController = async (req, res, next) => {
    try {
        const user = {
            name: req.body.name || undefined,
            email: req.body.email || undefined,
            role: req.body.roleID | undefined,
            phone: req.body.phone || undefined,
            status: req.body.status | undefined,

        };
        if (req.body.password) {
            const saltRounds = 10,
                plainPassword = req.body.password;

            const password = await bcrypt.hash(plainPassword, saltRounds);
            user.password = password;
        }

        const updated_user = await Prisma.User.update(
            {
                where: {
                    id: parseInt(req.params.id)
                },
                data: user
            }
        );
        return Response.sendResponse(
            res, {
            msg: '301',
            data: {
                user: updated_user,
            },
            lang: req.params.lang
        });
    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });
    }
}


// //delete User

const deleteUserController = async (req, res, next) => {
    try {
        const where = {
            id: parseInt(req.params.id),
        };
        const deleted_user = await Prisma.User.update({ where, data: { status: 0 } });
        
        return Response.sendResponse(
            res, {
            msg: '302',
            data: {
                user: deleted_user,
            },
            lang: req.params.lang
        });

    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });

    }
}
module.exports = {
    createUserController,
    findUserWithToken,
    findOneUserController,
    findAllUserController,
    updateUserController,
    deleteUserController
};