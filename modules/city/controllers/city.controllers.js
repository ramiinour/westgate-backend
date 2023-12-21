const { PrismaClient } = require("@prisma/client")
const Response = require("../../../configuration/config.response")

const prisma = new PrismaClient();


const getAll = async (req, res, next) => {
    // const { count, page, sort } = req.params
    const { countryId } = req.query

    let query = {
        // take: parseInt(count),
        // skip: (parseInt(page) - 1) * parseInt(count),
        // orderBy: {
        //     createdAt: sort
        // },
        select: {
            id: true,
            name: true,
            country: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    };
    if (countryId && countryId != "null" && countryId != 0) {
        query = {
            where: {
                countryId: parseInt(countryId)
            },
            // take: parseInt(count),
            // skip: (parseInt(page) - 1) * parseInt(count),
            // orderBy: {
            //     createdAt: sort
            // },

            select: {
                id: true,
                name: true,
                country: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        };
    }
    try {
        const data = await prisma.city.findMany(query)
        if (data) {
            return Response.sendResponse(res, {
                msg: '1304',
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
        const data = await prisma.city.findUnique({
            where: { id: parseInt(id) },
            include: {
                country: true,
                area: {
                    select: {
                        id: true,
                        name: true,
                        mainImage: true,
                        // get minimum price in this area 
                        project: {
                            select: {
                                id: true,
                                price: true
                            },
                            orderBy: {
                                price: 'asc'
                            },
                            take: 2

                        },

                    },
                },

            }
        })
        if (data) {
            return Response.sendResponse(res, {
                msg: '1303',
                data: {
                    data: data
                },
                lang: req.params.lang
            });
        } else {
            return res.status(500).json({
                "success": 0,
                "message": "City Does Not Exist",
                "response": 400,
                "data": {}
            })
        }
    } catch (err) {
        console.log(err)
        return next({ msg: 3067 });
    }
}

const createCity = async (req, res, next) => {
    const { name, countryId } = req.body
    try {
        const data = await prisma.city.create({
            data: {
                name,
                country: {
                    connect: {
                        id: countryId
                    }
                }
            },

            // include: {
            //     area: true
            // }
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

const deleteCity = async (req, res, next) => {
    const { id } = req.params
    try {
        const data = await prisma.city.delete({
            where: { id: parseInt(id) },
            include: {
                country: true
            }
        })
        console.log('==============', data)
        if (data) {
            return Response.sendResponse(res, {
                msg: '1302',
                data: {
                    data: data
                },
                lang: req.params.lang
            });
        } else {
            return res.status(500).json({
                "success": 0,
                "message": "City Does Not Exist",
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
    createCity,
    deleteCity
};
