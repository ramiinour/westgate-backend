const { PrismaClient } = require("@prisma/client")
const Response = require("../../../configuration/config.response")

const prisma = new PrismaClient({
    log: ['error', 'info', 'query', 'warn']
});


const getAll = async (req, res, next) => {
    const {search,area} = req.query;
    const { count, page, sort } = req.params
    const searchQuery = {
        AND:[]
    }

    const areas = area?.map((item) => parseInt(item));
    console.log("areas",areas);

    if(area && area?.length > 0){
        searchQuery.AND.push({
            area:{some:{AND:[{areaId:{in:areas}}]}}
        })
    }

    if(search && search != ""){
        searchQuery.AND.push({
            name: {contains:search}
        })
    }
    let sortObj = {}
    //propertyPrice
    switch(sort){
        case "desc": sortObj = {createdAt:"desc"}
        break
        case "asc": sortObj = {createdAt:"asc"}
        break;
        case "priceDesc": sortObj = {project:{_count:"desc"}}
        break;
        case "priceAsc":sortObj = {project:{_count:"asc"}}
        break
        default: sortObj = {createdAt:"desc"}
    }
    try {
        const data = await prisma.developer.findMany({
            take: parseInt(count),
            skip: (parseInt(page) - 1) * parseInt(count),
            where:{
                ...searchQuery,
            //    area:{
            //     some:{AND:[{areaId:{in:[20]}}]}
            //    }

            },
            orderBy: sortObj,
            include: {
                developerImage: {
                    select: {
                        id: true,
                        image: true,
                    }
                },
                area: {
                    select: {
                        areaId: true,
                        developerId: true,
                        area: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }

                },
                agent: {
                    select: {
                        agentId: true,
                        developerId: true,
                        agent: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            }
                        }
                    }
                },
                project: {
                    orderBy: {
                        createdAt: 'desc' // Order by creation date in descending order
                    },
                    take: 6
                },
                property: {
                    orderBy: {
                        createdAt: 'desc' // Order by creation date in descending order
                    },
                    take: 6
                }
            }

        });

        const developerCount = await prisma.developer.findMany({
            where:{
                ...searchQuery
            }
        });

        let totalPages = (parseInt(developerCount.length) / parseInt(count))
        totalPages = Number.isInteger(totalPages) ? totalPages : parseInt(totalPages) + 1

        return Response.sendResponse(res, {
            msg: '1104',
            data: {
                data: data,
                count: developerCount.length,
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

const getOne = async (req, res, next) => {
    const { name } = req.params

    try {

        const developer = await prisma.developer.findUnique({
            where: {
                name: name
            }
        })
        if (!developer) {
            return res.status(500).json({
                "success": 0,
                "message": "Developer Does Not Exist",
                "response": 500,
                "data": {}
            })
        }

        const data = await prisma.developer.findUnique({
            where: {
                id: parseInt(developer.id)
            },
            include: {
                developerImage: {
                    select: {
                        id: true,
                        image: true,
                    }
                },
                area: {
                    select: {
                        areaId: true,
                        developerId: true,
                        area: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }

                },
                agent: {
                    select: {
                        agentId: true,
                        developerId: true,
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
                            }
                        }
                    },
                    where: {
                        agent: {
                            status: 1
                        }
                    }
                },
                project: {
                    where: {
                        developerId: parseInt(developer.id),
                        status: 1
                    },
                    orderBy: {

                        createdAt: 'desc' // Order by creation date in descending order
                    },
                    include: {
                        images: true,
                        mainImagesProject: true
                    },
                    take: 6
                },
                property: {
                    where: {
                        developerId: parseInt(developer.id),
                        status: 1
                    },
                    orderBy: {
                        createdAt: 'desc' // Order by creation date in descending order
                    },
                    include: {
                        images: true,
                    },
                    take: 6
                }
            }
        });

        const minPrice = await prisma.project.aggregate({
            where: {
                developerId: parseInt(developer.id),
            },
            _min: {
                price: true,
            },
        });

        const countProjects = await prisma.project.count({
            where: {
                developerId: parseInt(developer.id),
            },

        });

        const countProperties = await prisma.property.count({
            where: {
                developerId: parseInt(developer.id),
            },

        });

        if (data) {
            return Response.sendResponse(res, {
                msg: '1103',
                data: {
                    countProperties: countProperties,
                    countProjects: countProjects,
                    minPrice: minPrice._min.price,
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
const getOneById = async (req, res, next) => {
    const { id } = req.params

    try {


        const data = await prisma.developer.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                developerImage: {
                    select: {
                        id: true,
                        image: true,
                    }
                },
                area: {
                    take:7,
                    select: {
                        areaId: true,
                        developerId: true,
                        area: {
                            select: {
                                id: true,
                                name: true,
                                mainImage:true,
                                property:true
                            }
                        }
                        
                    }

                },
                project:{
                   select:{
                    id:true
                   }
                }
               
            }
        });

        const minPrice = await prisma.project.aggregate({
            where: {
                developerId: parseInt(id),
            },
            _min: {
                price: true,
            },
        });

        const countProjects = await prisma.project.count({
            where: {
                developerId: parseInt(id),
            },

        });

        const countProperties = await prisma.property.count({
            where: {
                developerId: parseInt(id),
            },

        });

        if (data) {
            return Response.sendResponse(res, {
                msg: '1103',
                data: {
                    countProperties: countProperties,
                    countProjects: countProjects,
                    minPrice: minPrice._min.price,
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

const getNameIdDevelopers = async (req, res, next) => {
    const { areaId } = req.query
    console.log("dkkdkdkdkdkdkdk",areaId)

    let query = {}
    if (areaId && areaId != 0) {
        query = {
            where: {
                area: {
                    some: {
                        areaId: parseInt(areaId),
                    },
                }
            },
            select: {
                id: true,
                name: true,
                logo: true,
            }
        }

    } else {
        query = {
            select: {
                id: true,
                name: true,
                logo: true,
            }
        }
    }

    try {
        const data = await prisma.developer.findMany(query);

        // const developerCount = await prisma.developer.findMany();

        // let totalPages = (parseInt(developerCount.length) / parseInt(count))
        // totalPages = Number.isInteger(totalPages) ? totalPages : parseInt(totalPages) + 1

        return Response.sendResponse(res, {
            msg: '1105',
            data: {
                data: data,
                // count: developerCount.length,
                // page: page,
                // totalPages: totalPages
            },
            lang: req.params.lang
        });
    } catch (err) {
        console.log(err)
        return next({ msg: 3067 });
    }

}

const firstFiveDevelopers = async (req, res, next) => {

    try {
        const data = await prisma.developer.findMany({
            take: 5,
            select: {
                id: true,
                name: true,
            },
            orderBy:{
                project:{
                   _count:"desc"
                }
            }
        });

        return Response.sendResponse(res, {
            msg: '1104',
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



const createDeveloper = async (req, res, next) => {
    const {
        name,
        foundIn,
        about,
        management,
        economicAttractive,
        mainImage,
        logo,
        developerImage,
        agentsList,
        areaDeveloper } = req.body;
    try {
        const data = await prisma.developer.create({
            data: {
                name,
                foundIn,
                about,
                management,
                economicAttractive,
                mainImage,
                logo,
                developerImage: {
                    create: developerImage?.map(i => ({
                        image: i
                    }))
                },
                area: {
                    create: areaDeveloper?.map(id => ({
                        area: {
                            connect: {
                                id: parseInt(id),
                            },
                        }
                    }))
                },
                agent: {
                    create: agentsList?.map(agentId => ({
                        agent: {
                            connect: {
                                id: parseInt(agentId)
                            }
                        }
                    }))
                }

            },
            include: {
                developerImage: {
                    select: {
                        id: true,
                        image: true,
                    }
                },
                area: {
                    select: {
                        areaId: true,
                        developerId: true,
                        area: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }

                },
                agent: {
                    select: {
                        agentId: true,
                        developerId: true,
                        agent: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            }
                        }
                    }
                },
                project: {
                    orderBy: {
                        createdAt: 'desc' // Order by creation date in descending order
                    },
                    take: 6
                },
                property: {
                    orderBy: {
                        createdAt: 'desc' // Order by creation date in descending order
                    },
                    take: 6
                }
            }
        })

        return Response.sendResponse(res, {
            msg: '1100',
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

const updateDeveloper = async (req, res, next) => {
    const { id } = req.params
    const {
        developerImage,
        areaDeveloper,
        agentsList,
        ...dataToUpdate } = req.body;
    try {

        // remove the previous developer Image
        const removeImages = await prisma.developerImage.deleteMany({
            where: {
                developerId: parseInt(id)
            }
        })

        // remove the previous areas 
        const removeAreas = await prisma.AreaDeveloper.deleteMany({
            where: {
                developerId: parseInt(id)
            }
        })

        // remove the previous areas 
        const removeAgents = await prisma.agentDeveloper.deleteMany({
            where: {
                developerId: parseInt(id)
            }
        })

        const data = await prisma.developer.update({
            where: {
                id: parseInt(id)
            },
            data: {
                ...dataToUpdate,


                agent: {
                    create: agentsList?.map(agentId => ({
                        agent: {
                            connect: {
                                id: agentId
                            }
                        }
                    }))
                },
                developerImage: {
                    create: developerImage?.map(i => ({
                        image: i,

                    }))
                },
                area: {
                    create: areaDeveloper?.map(id => ({
                        area: {
                            connect: {
                                id: id,
                            },
                        }
                    }))
                },
            },
            include: {
                developerImage: {
                    select: {
                        id: true,
                        image: true,
                    }
                },
                area: {
                    select: {
                        areaId: true,
                        developerId: true,
                        area: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }

                },
                agent: {
                    select: {
                        agentId: true,
                        developerId: true,
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
                            }
                        }
                    }
                },
                project: {
                    orderBy: {
                        createdAt: 'desc' // Order by creation date in descending order
                    },
                    take: 6
                },
                property: {
                    orderBy: {
                        createdAt: 'desc' // Order by creation date in descending order
                    },
                    take: 6
                }
            }
        })

        return Response.sendResponse(res, {
            msg: '1101',
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

const deleteDeveloper = async (req, res, next) => {
    const { id } = req.params
    try {
        // remove the previous developer Image
        const removeImages = await prisma.developerImage.deleteMany({
            where: {
                developerId: parseInt(id)
            }
        })

        // remove the previous areas 
        const removeAreas = await prisma.AreaDeveloper.deleteMany({
            where: {
                developerId: parseInt(id)
            }
        })

        // remove the previous areas 
        const removeAgents = await prisma.agentDeveloper.deleteMany({
            where: {
                developerId: parseInt(id)
            }
        })
        const data = await prisma.developer.delete({
            where: {
                id: parseInt(id)
            },
            include: {
                developerImage: {
                    select: {
                        id: true,
                        image: true,
                    }
                },
                area: {
                    select: {
                        areaId: true,
                        developerId: true,
                        area: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }

                },
                agent: {
                    select: {
                        agentId: true,
                        developerId: true,
                        agent: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            }
                        }
                    }
                },
                project: {
                    orderBy: {
                        createdAt: 'desc' // Order by creation date in descending order
                    },
                    take: 6
                },
                property: {
                    orderBy: {
                        createdAt: 'desc' // Order by creation date in descending order
                    },
                    take: 6
                }
            }
        })
        if (data) {
            return Response.sendResponse(res, {
                msg: '1102',
                data: {
                    data: data
                },
                lang: req.params.lang
            });
        } else {
            return Response.sendResponse(res, {
                msg: 'Developer Does not Exist',
                data: {
                    data: data
                },
                lang: req.params.lang
            });
        }


    } catch (err) {
        if (err?.meta?.cause == 'Record to delete does not exist.') {
            return res.status(200).json({
                "success": 1,
                "message": "Developer Does not Exist",
                "response": 400,
                "data": []
            });
        }
        console.log(err);
        return next({ msg: 3067 });
    }

}

module.exports = {
    getAll,
    getOne,
    getNameIdDevelopers,
    createDeveloper,
    updateDeveloper,
    deleteDeveloper,
    firstFiveDevelopers,
    getOneById
};
