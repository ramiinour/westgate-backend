const { PrismaClient } = require("@prisma/client")
const Response = require("../../../configuration/config.response")

const prisma = new PrismaClient();


const getAll = async (req, res, next) => {
    try {
        const data = await prisma.area.findMany({
            include: {
                areaImage: true,
                areaFeature: {
                    include: {
                        featureImage: true
                    }
                },
                city: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }

        });


        return Response.sendResponse(res, {
            msg: '703',
            data: {
                data: data,
            },
            lang: req.params.lang
        });
    } catch (err) {
        console.log(err)
        return next({ msg: 3067 });
    }

}



const getAllCountPageSort = async (req, res, next) => {
    const {search} = req.query;
    const { count, page, sort } = req.params
    const searchQuery = {
        AND:[

        ]
    }
    if(search && search != ""){
        searchQuery.AND.push({
            name:{contains:search}
        })
    }

   
    let sortObj = {}
    //propertyPrice
    switch(sort){
        case "desc": sortObj = {createdAt:"desc"}
        break
        case "asc": sortObj = {createdAt:"asc"}
        break;
        case "priceDesc": sortObj = {property:{_count:"desc"}}
        break;
        case "priceAsc":sortObj = {property:{_count:"asc"}}
        break
        default: sortObj = {createdAt:"desc"}
    }
    try {
        const data = await prisma.area.findMany({
            take: parseInt(count),
            skip: (parseInt(page) - 1) * parseInt(count),
            where:{
                ...searchQuery,
               
            },
            orderBy: sortObj,
            include: {
                areaImage: true,
                areaFeature: {
                    include: {
                        featureImage: true
                    }
                },
                property:{
                    select:{
                        propertyPrice:true
                    }
                },  
                city: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }

        });

        const areaCount = await prisma.area.findMany({
            where:{
                ...searchQuery
            }
        });

        let totalPages = (parseInt(areaCount.length) / parseInt(count))
        totalPages = Number.isInteger(totalPages) ? totalPages : parseInt(totalPages) + 1

        return Response.sendResponse(res, {
            msg: '703',
            data: {
                data: data,
                count: areaCount.length,
                page: page,
                totalPages: totalPages
            },
            lang: req.params.lang
        });
    } catch (err) {
        console.log(err)
        return next({ msg: 3067 });
    }

}

const getNamesAreas = async (req, res, next) => {
    const { cityId } = req.query
    let query = {}
    if (cityId && cityId != "null") {
        query = {
            where: {
                cityId: parseInt(cityId)
            },
            orderBy: {
                name: 'asc'
            },
            select: {
                id: true,
                name: true,
                mainImage: true,
                city: {
                    select: {
                        id: true,
                        name: true,

                    }
                },
                property: {
                    where: {
                        status: 1
                    },
                    select: {
                        id: true,
                        propertyPrice: true,
                    },
                    orderBy: {
                        propertyPrice: 'asc',
                    },
                    take: 1,
                },
            }
        }
    } else {
        query = {
            select: {
                id: true,
                name: true,
                mainImage: true,
                city: {
                    select: {
                        id: true,
                        name: true,

                    },
                },
                property: {
                    where: {
                        status: 1
                    },
                    select: {
                        id: true,
                        propertyPrice: true,
                    },
                    orderBy: {
                        propertyPrice: 'asc',
                    },
                    take: 1,
                },
            }
        }
    }
    try {
        const data = await prisma.area.findMany(query);


        return Response.sendResponse(res, {
            msg: '703',
            data: {
                data: data,
            },
            lang: req.params.lang
        });
    } catch (err) {
        console.log(err)
        return next({ msg: 3067 });
    }

}

const firstFiveAreas = async (req, res, next) => {

    try {
        const data = await prisma.area.findMany({
            take: 5,
            select: {
                id: true,
                name: true,
            }
        });

        return Response.sendResponse(res, {
            msg: '703',
            data: {
                data: data,
            },
            lang: req.params.lang
        });
    } catch (err) {
        console.log(err)
        return next({ msg: 3067 });
    }

}

const getPopularAreas = async (req,res,next) => {
    try{
        const data = await prisma.area.findMany({
           
            take:7,
            orderBy:{
                property:{
                    _count: "desc"
                }
            },
            include:{
                property:{
                    orderBy:{
                        propertyPrice:"asc"
                    }
                }
            }
            
        });

       

        return Response.sendResponse(res, {
            msg: '1005',
            data: {
                data: data,
                count: data.length,
                
            },
            lang: req.params.lang
        });
    }catch(err){
        console.log(err)
        return next({ msg: 3067 });
    }
}

const getOne = async (req, res, next) => {
    const { name } = req.params

    try {
        const area = await prisma.area.findUnique({
            where: {
                name: name
            }
        });
        
        if (!area) {
            return res.status(500).json({
                "success": 0,
                "message": "Area Does Not Exist",
                "response": 500,
                "data": {}
            })
        }

        const data = await prisma.area.findUnique({
            where: {
                id: parseInt(area.id)
            },
            include: {
                areaImage: true,
                areaFeature: {
                    include: {
                        featureImage: true
                    }
                },
                developer: {
                    include: {
                        developer: {
                            select: {
                                id: true,
                                name: true,
                                logo: true,
                            }
                        }
                    }
                },
                city: {
                    select: {
                        id: true,
                        name: true,
                        country: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                    }
                },

                project: {
                    where: {
                        areaId: parseInt(area.id),
                        status: 1
                    },
                    orderBy: {
                        createdAt: 'desc' // Order by creation date in descending order
                    },
                    take: 2
                },
                property: {
                    where: {
                        areaId: parseInt(area.id),
                        isbuy: true,
                        status: 1
                    },
                    include: {
                        images: true,
                    },
                    orderBy: {
                        createdAt: 'desc' // Order by creation date in descending order
                    },
                    take: 4
                },
                agent: {

                    include: {

                        agent: {

                            select: {

                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                phoneNumber: true,
                                cellNumber: true,
                                gender: true,
                                facebookUrl: true,
                                twitterUrl: true,
                                googleUrl: true,
                                description: true,
                                address: true,
                                avatar: true,
                                zipCode: true,
                                dateOfBirth: true,
                                status: true,
                                token: true,
                                websiteUrl: true,
                                linkedInUrl: true,
                                createdAt: true,
                                updatedAt: true,
                                // status: true
                            }
                        }
                    },
                    where: {
                        agent: {
                            status: 1
                        }
                    }
                }
            }
        });

        if (data) {
            return Response.sendResponse(res, {
                msg: '1003',
                data: {
                    data: data
                },
                lang: req.params.lang
            });
        } else {
            return res.status(500).json({
                "success": 0,
                "message": "Area Does Not Exist",
                "response": 500,
                "data": {}
            })
        }
    } catch (err) {
        console.log(err)
        return next({ msg: 3067 });
    }

}

const getOnById = async (req, res, next) => {
    const { id } = req.params

    try {
       
        const data = await prisma.area.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                areaImage: true,
                areaFeature: {
                    include: {
                        featureImage: true
                    }
                },
                developer: {
                    include: {
                        developer: {
                            select: {
                                id: true,
                                name: true,
                                logo: true,
                            }
                        }
                    }
                },
                city: {
                    select: {
                        id: true,
                        name: true,
                        country: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                    }
                },

                project: {
                    where: {
                        areaId: parseInt(id),
                        status: 1
                    },
                    orderBy: {
                        createdAt: 'desc' // Order by creation date in descending order
                    },
                    take: 2
                },
                property: {
                    where: {
                        areaId: parseInt(id),
                        isbuy: true,
                        status: 1
                    },
                    include: {
                        images: true,
                    },
                    orderBy: {
                        createdAt: 'desc' // Order by creation date in descending order
                    },
                    take: 4
                },
                agent: {

                    include: {

                        agent: {

                            select: {

                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                phoneNumber: true,
                                cellNumber: true,
                                gender: true,
                                facebookUrl: true,
                                twitterUrl: true,
                                googleUrl: true,
                                description: true,
                                address: true,
                                avatar: true,
                                zipCode: true,
                                dateOfBirth: true,
                                status: true,
                                token: true,
                                websiteUrl: true,
                                linkedInUrl: true,
                                createdAt: true,
                                updatedAt: true,
                                // status: true
                            }
                        }
                    },
                    where: {
                        agent: {
                            status: 1
                        }
                    }
                }
            }
        });

        if (data) {
            return Response.sendResponse(res, {
                msg: '1003',
                data: {
                    data: data
                },
                lang: req.params.lang
            });
        } else {
            return res.status(500).json({
                "success": 0,
                "message": "Area Does Not Exist",
                "response": 500,
                "data": {}
            })
        }
    } catch (err) {
        console.log(err)
        return next({ msg: 3067 });
    }

}

const createArea = async (req, res, next) => {
    const { name, about, infrastructure, attractions, mainImage, images, areaFeature, cityId } = req.body;
    try {

        const checkIfNameExists = await prisma.area.findFirst({
            where:{
                name
            }
        })

        if(checkIfNameExists) return next({ msg: 656 });

        const data = await prisma.area.create({
            data: {
                name,
                about,
                infrastructure,
                attractions,
                mainImage,
                areaImage: {
                    create: images?.map(i => ({
                        image: i
                    }))
                },
                areaFeature: {
                    create: areaFeature?.map(desc => ({
                        description: desc.description,
                        featureImage: {
                            create: desc.featureImage?.map(item => ({
                                image: item?.image
                            })),
                        }
                    })),

                },
                city: {
                    connect: {
                        id: parseInt(cityId)
                    }
                }
            },
            include: {
                areaImage: true,
                areaFeature: {
                    include: {
                        featureImage: true
                    }
                },
                city: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        return Response.sendResponse(res, {
            msg: '1000',
            data: {
                data: data
            },
            lang: req.params.lang
        });

    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });

    }

}

const updateArea = async (req, res, next) => {
    const { id } = req.params
    const { cityId, images, areaFeature, ...dataToUpdate } = req.body;
    try {
        // remove previous featureArea
        const removeAreaFeature = await prisma.areaFeature.deleteMany({
            where: {
                areaId: parseInt(id)
            },
        })

        // remove previous Images Area
        const removeAreaImages = await prisma.areaImage.deleteMany({
            where: {
                areaId: parseInt(id)
            },
        })
        console.log(removeAreaImages)
        const data = await prisma.area.update({
            where: {
                id: parseInt(id)
            },
            data: {
                ...dataToUpdate,
                areaImage: {
                    create: images?.map(i => ({
                        image: i
                    }))
                },
                areaFeature: {
                    create: areaFeature?.map(desc => ({
                        description: desc?.description,
                        featureImage: {
                            create: desc?.featureImage?.map(item => ({
                                image: item?.image
                            })),
                        }
                    })),

                },
                city: {
                    connect: {
                        id: parseInt(cityId)
                    }
                }
            },
            include: {
                areaImage: true,
                areaFeature: {
                    include: {
                        featureImage: true
                    }
                },
                city: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })

        return Response.sendResponse(res, {
            msg: '1001',
            data: {
                data: data
            },
            lang: req.params.lang
        });

    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });

    }

}

const deleteArea = async (req, res, next) => {
    const { id } = req.params

    try {
        const data = await prisma.area.delete({
            where: {
                id: parseInt(id)
            },
            include: {
                areaImage: true,
                areaFeature: {
                    include: {
                        featureImage: true
                    }
                },
                city: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })
        if (data) {
            return Response.sendResponse(res, {
                msg: '1002',
                data: {
                    data: data
                },
                lang: req.params.lang
            });
        } else {
            return Response.sendResponse(res, {
                msg: 'Area Does not Exist',
                // data: {
                //     data: data
                // },
                lang: req.params.lang
            });
        }

    } catch (err) {
        if (err?.meta?.field_name == 'areaId') {
            return res.status(200).json({
                message: 'this Area has props/projects',
                lang: req.params.lang
            });
        } else if (err?.meta?.cause == 'Record to delete does not exist.') {
            return res.status(200).json({
                message: 'Area Does not Exist',
                lang: req.params.lang
            });
        }
        console.log(err);
        return next({ msg: 3067 });
    }

}

module.exports = {
    getAll,
    getAllCountPageSort,
    getOne,
    createArea,
    updateArea,
    deleteArea,
    getNamesAreas,
    firstFiveAreas,
    getOnById,
    getPopularAreas
};