const { PrismaClient } = require("@prisma/client")
const Response = require("../../../configuration/config.response")

const prisma = new PrismaClient();


const getAll = async (req, res, next) => {
    // const { count, page, sort } = req.params
    try {
        const data = await prisma.country.findMany({
            // take: parseInt(count),
            // skip: (parseInt(page) - 1) * parseInt(count),
            // orderBy: {
            //     createdAt: sort
            // },
            select: {
                id: true,
                name: true,
                city: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
            
        })
        if (data) {
            return Response.sendResponse(res, {
                msg: '1204',
                data: {
                    data: data
                },
                lang: req.params.lang
            });
        } else {
            return res.status(500).json({
                "success": 0,
                "message": "Developer Does Not Exist",
                "response": 500,
                "data": {}
            })
        }
    } catch (err) {
        console.log(err)
        return next({ msg: 3067 });
    }
}

const getOne = async (req, res, next) => {
    const { id } = req.params
    try {
        const data = await prisma.country.findUnique({
            where: { id: parseInt(id) },
            include: {
                city: true
            }
        })
        if (data) {
            return Response.sendResponse(res, {
                msg: '1203',
                data: {
                    data: data
                },
                lang: req.params.lang
            });
        } else {
            return res.status(500).json({
                "success": 0,
                "message": "Country Does Not Exist",
                "response": 400,
                "data": {}
            })
        }
    } catch (err) {
        console.log(err)
        return next({ msg: 3067 });
    }
}

const createCountry = async (req, res, next) => {
    const { name } = req.body
    try {
        const data = await prisma.country.create({
            data: { name },
            include: {
                city: true
            }
        })
        return Response.sendResponse(res, {
            msg: '1200',
            data: {
                data: data
            },
            lang: req.params.lang
        });

    } catch (err) {
        console.log(err)
        return next({ msg: 3067 });
    }
}

const deleteCountry = async (req, res, next) => {
    const { id } = req.params
    try {
        const data = await prisma.country.delete({
            where: { id: parseInt(id) },
            include: {
                city: true
            }
        })
        if (data) {
            return Response.sendResponse(res, {
                msg: '1202',
                data: {
                    data: data
                },
                lang: req.params.lang
            });
        } else {
            return res.status(500).json({
                "success": 0,
                "message": "Country Does Not Exist",
                "response": 400,
                "data": {}
            })
        }
    } catch (err) {
        console.log(err)
        return next({ msg: 3067 });
    }
}


module.exports = {
    getAll,
    getOne,
    createCountry,
    deleteCountry
};
