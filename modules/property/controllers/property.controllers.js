const { config } = require('dotenv');

const Response = require('../../../configuration/config.response'),
    { PrismaClient } = require('@prisma/client'),
    { sendEmail } = require("../../../configuration/config.mailer"),
    ejs = require("ejs"),
    Prisma = new PrismaClient();


const createProperty = async (req, res, next) => {
    try {
        
    
        const { title, description, propertyRef, propertyPrice, phone, area,
            cityId, countryId, developerId, areaId,
        } = req.body;
        let { amenetiesIds, specificationIds, nearBy, images } = req.body;
        if (!title || !description || !propertyPrice || !propertyRef || !phone) {
            return next({ msg: 500 });
        }



        const isRent = req.body.isrent || false

        // Set isBuy based on isRent
        const isBuy = !isRent;

        const property = {
            title: req.body.title,
            description: req.body.description,
            propertyRef: req.body.propertyRef,
            propertyType: req.body.propertyType,
            propertyPrice: req.body.propertyPrice,
            // teamMemberId: req.user.id,
            teamMember: {
                connect: {
                    id: req.body.teamMemberId && req.body.teamMemberId != -1 ? parseInt(req.body.teamMemberId):parseInt(req.user.id)
                },
            },
            phone: req.body.phone,
            isrent: isRent,
            isbuy: isBuy,

        };

        if (req.body.projectId) {
            const projectExist = await Prisma.Project.findUnique({
                where: {
                    id: parseInt(req.body.projectId)
                }
            })

            if (!projectExist) {
                return next({ msg: 504 });
            }
            property.projectId = req.body.projectId
        }

        if (req.body.lat && req.body.lon) {
            property.lat = req.body.lat
            property.lon = req.body.lon
        }
        if (req.body.address &&
            // req.body.city &&
            req.body.zipCode
            // &&
            // req.body.country
        ) {
            property.address = req.body.address
            // property.city = req.body.city
            property.zipCode = req.body.zipCode
            // property.country = req.body.country
        }
        if (req.body.facebook && req.body.linkedin && req.body.twitter) {
            property.facebook = req.body.facebook
            property.linkedin = req.body.linkedin
            property.twitter = req.body.twitter
        }
        if (req.body.isrent) {
            property.isrent = req.body.isrent
        }
        if (req.body.averagePropertyLink && req.body.phone) {
            property.averagePropertyLink = req.body.averagePropertyLink
            property.propertySalesLink = req.body.propertySalesLink
        }
        if (req.body.videoUrl) {
            property.videoUrl = req.body.videoUrl
        }
        if (req.body.currency) {
            property.currency = req.body.currency
        }
        if (req.body.area) {
            property.area = parseFloat(req.body.area)
        }
        if (req.body.propertyType) {
            property.propertyType = req.body.propertyType
        }
        if (amenetiesIds && amenetiesIds.length > 0) {
            amenetiesIds = amenetiesIds.map((item) => {
                return {
                    AmenitiesId: item,
                }
            });
            property.amenities = {
                create: amenetiesIds
            }
        }
        if (nearBy && nearBy.length > 0) {
            for (let i = 0; i < nearBy.length; i++) {
                if (!nearBy[i].name) {
                    return next({ msg: 501 });
                }
            }
            nearBy = nearBy.map(item => {
                return {
                    name: item.name,
                    description: item.description || null,
                    ratings: item.ratings || 0
                }
            });
            property.nearBy = {
                create: nearBy
            }
        }
        if (specificationIds && specificationIds.length > 0) {
            specificationIds = specificationIds.map((item) => {

                return {
                    SpecificationId: item.id,
                    answer: item.answer
                }
            });
            property.specification = {
                create: specificationIds
            }
        }
        if (images && images.length > 0) {
            images = images.map(item => {
                return {
                    link: item
                }
            });
            property.images = {
                create: images
            }
        }

        property.city = {
            connect: {
                id: parseInt(cityId)
            }
        }
        property.country = {
            connect: {
                id: parseInt(countryId)
            }
        }
        property.areaPlace = {
            connect: {
                id: parseInt(areaId)
            }
        }
        property.developer = {
            connect: {
                id: parseInt(developerId)
            }
        }

        try{
            const created_property = await Prisma.Property.create({
                data: property,
    
    
                include: {
                    areaPlace: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    city: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    country: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    developer: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    specification: {
                        include: {
                            specification: true
                        }
                    }
                }
    
            });

            return Response.sendResponse(
                res, {
                msg: '500',
                data: {
                    property: created_property,
                },
                lang: req.params.lang
            });
        }catch(e){
            return next({msg:4012})
        }

       
        // const createRoomSpecification = await Prisma.specification.update({
        //     where: {
        //         id: specifica
        //     }
        // })

     
    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });

    }
}

const addAmenitiesAndSpecifications = async (req, res, next) => {
    try {

        // const amenities = [
        //     'balcony',
        //     'closeToMetro',
        //     'highFloor',
        //     'fitted',
        //     'InvestmentProperty',
        //     'landmarkView',
        //     'kitchenAppliances',
        //     'gatedCommunity',
        //     'openKitchen',
        //     'vastuCompliant',
        //     'builtWardrobes',
        //     'airConditioning',
        //     'amenitiesGym',
        //     'landmarkView',
        //     'centralAC',
        // ];

        const specifications = [
            "size",
            "beds",
            "baths",
            "parking",
            "developers",
        ];

        // const payment =[
        //     "Bitcoin",
        //     "Bank transfer",
        //     "Credit card",
        //     "Cheques",
        // ];

        const specificationRecords = await Promise.all(
            specifications.map((specification) => {
                return Prisma.Specification.create({
                    data: {
                        key: specification,
                    },
                });
            })
        );



        return Response.sendResponse(
            res, {
            msg: '505',
            data: {
                specificationRecords: specificationRecords,
            },
            lang: req.params.lang
        });


    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });

    }
}

//Get One Property BY Name
const findOneProperty = async (req, res, next) => {
    try {
    const {name} = req.params
    
    const property = await Prisma.Property.findUnique({
        where: {
            title: name
        }
    });
    
    if (!property) {
        return res.status(500).json({
            "success": 0,
            "message": "Property Does Not Exist",
            "response": 500,
            "data": {}
        })
    }

    const selector = {
        where: {
            id: parseInt(property.id),
            status: 1,
        },
        include: {
            areaPlace: {
                select: {
                    id: true,
                    name: true
                }
            },
            developer: {
                select: {
                    id: true,
                    name: true
                }
            },
            city: {
                select: {
                    id: true,
                    name: true
                }
            },
            country: {
                select: {
                    id: true,
                    name: true
                }
            },
            amenities: {
                include: {
                    amenities: true
                }
            },
            specification: {
                include: {
                    specification: true
                }
            },
            nearBy: true,
            images: true,
            teamMember: true
        }
    };


    const foundProperty = await Prisma.Property.findFirst(selector);

    if (!foundProperty) {
        return next({ msg: 503 })
    }


    
        return Response.sendResponse(
            res,
            {
                msg: '503',
                data: {
                    property: foundProperty,
                },
                lang: req.params.lang
            });

    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });

    }
}

// get one property by name and area name
const findOnePropertyByNameAndArea = async (req, res, next) => {
    try {
    const {name,areaName} = req.params
    
   
    const selector = {
        where:{
            title:name?.replaceAll("-"," "),
            areaPlace:{
                name:areaName?.replaceAll("-"," ")
            }
        },
        include: {
            areaPlace: {
                select: {
                    id: true,
                    name: true
                }
            },
            developer: {
                select: {
                    id: true,
                    name: true
                }
            },
            city: {
                select: {
                    id: true,
                    name: true
                }
            },
            country: {
                select: {
                    id: true,
                    name: true
                }
            },
            amenities: {
                include: {
                    amenities: true
                }
            },
            specification: {
                include: {
                    specification: true
                }
            },
            nearBy: true,
            images: true,
            teamMember: true
        }
    };

   



    const foundProperty = await Prisma.Property.findFirst(selector);

    if (!foundProperty) {
        return next({ msg: 503 })
    }


    
        return Response.sendResponse(
            res,
            {
                msg: '503',
                data: {
                    property: foundProperty,
                },
                lang: req.params.lang
            });

    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });

    }
}

const findOnePropertyById = async (req, res, next) => {
    try {
    const {id} = req.params
    
    

    const selector = {
        where: {
            id: parseInt(id),
            status: 1,
        },
        include: {
            areaPlace: {
                select: {
                    id: true,
                    name: true
                }
            },
            developer: {
                select: {
                    id: true,
                    name: true
                }
            },
            city: {
                select: {
                    id: true,
                    name: true
                }
            },
            country: {
                select: {
                    id: true,
                    name: true
                }
            },
            amenities: {
                include: {
                    amenities: true
                }
            },
            specification: {
                include: {
                    specification: true
                }
            },
            nearBy: true,
            images: true,
            teamMember: true
        }
    };


    const foundProperty = await Prisma.Property.findFirst(selector);

    if (!foundProperty) {
        return next({ msg: 503 })
    }


    
        return Response.sendResponse(
            res,
            {
                msg: '503',
                data: {
                    property: foundProperty,
                },
                lang: req.params.lang
            });

    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });

    }
}

const findOneDraftPropertyById = async (req, res, next) => {
    try {
    const {id} = req.params
    
    

    const selector = {
        where: {
            id: parseInt(id),
            status: 0,
        },
        include: {
            areaPlace: {
                select: {
                    id: true,
                    name: true
                }
            },
            developer: {
                select: {
                    id: true,
                    name: true
                }
            },
            city: {
                select: {
                    id: true,
                    name: true
                }
            },
            country: {
                select: {
                    id: true,
                    name: true
                }
            },
            amenities: {
                include: {
                    amenities: true
                }
            },
            specification: {
                include: {
                    specification: true
                }
            },
            nearBy: true,
            images: true,
            teamMember: true
        }
    };


    const foundProperty = await Prisma.Property.findFirst(selector);

    if (!foundProperty) {
        return next({ msg: 503 })
    }


    
        return Response.sendResponse(
            res,
            {
                msg: '503',
                data: {
                    property: foundProperty,
                },
                lang: req.params.lang
            });

    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });

    }
}

const propertyOfDay = async (req, res, next) => {

    try {

        const selector = {
            where: {
                isPropertyOfTheDay: true,
                status: 1,
            },
            areaPlace: {
                select: {
                    id: true,
                    name: true
                }
            },
            developer: {
                select: {
                    id: true,
                    name: true
                }
            },
            city: {
                select: {
                    id: true,
                    name: true
                }
            },
            country: {
                select: {
                    id: true,
                    name: true
                }
            },
            include: {
                amenities: {
                    include: {
                        amenities: true
                    }
                },
                specification: {
                    include: {
                        specification: true
                    }
                },
                nearBy: true,
                images: true,
                teamMember: true
            }
        };


        const foundProperty = await Prisma.Property.findFirst(selector);

        return Response.sendResponse(
            res,
            {
                msg: '503',
                data: {
                    property: foundProperty,
                },
                lang: req.params.lang
            });

    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });

    }
}

//Find All Property
const findAllProperty = async (req, res, next) => {
    const { page, count } = req.params

    try {
        const all_property = await Prisma.Property.findMany({
            take: parseInt(req.params.count),
            skip: (parseInt(req.params.page) - 1) * parseInt(req.params.count),
            where: {
                status: 1
            },
            include: {
                areaPlace: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                developer: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                city: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                country: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                amenities: {
                    include: {
                        amenities: true
                    }
                },
                specification: {
                    include: {
                        specification: true
                    }
                },

                nearBy: true,
                images: true,
            },
            orderBy: {
                createdAt: req.query.sorting
            }
        });
        // let allProperties = all_property.map((prop) => {
        //     return {
        //         ...prop,
        //     }
        // })
        const propertiesCount = await Prisma.Property.findMany({
            where: {
                status: 1
            }
        });
        let totalPages = (parseInt(propertiesCount.length) / parseInt(count))

        totalPages = Number.isInteger(totalPages) ? totalPages : parseInt(totalPages) + 1

        return Response.sendResponse(
            res, {
            msg: '504',
            data: {
                property: all_property,
                page: page,
                count: parseInt(propertiesCount.length),
                totalPages: totalPages
            },
            lang: req.params.lang
        });
    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });

    }
}

//Find All Property With Agent Id
const findAllPropertiesWithAgent = async (req, res, next) => {
    const { page, count } = req.params
    // const {agentId} = req.query

    try {
        const all_property = await Prisma.Property.findMany({
            take: parseInt(count),
            skip: (parseInt(page) - 1) * parseInt(count),
            where: {
                status: 1,
                teamMemberId: parseInt(req.query.agentId)
            },
            include: {
                amenities: {
                    include: {
                        amenities: true
                    }
                },
                specification: {
                    include: {
                        specification: true
                    }
                },
                nearBy: true,
                images: true,
            },
            orderBy: {
                createdAt: req.query.sorting
            }
        });
        let allProperties = all_property.map((prop) => {
            return {
                ...prop,
            }
        })
        const propertiesCount = await Prisma.Property.findMany({
            where: {
                status: 1,
                teamMemberId: parseInt(req.query.agentId)
            }
        });
        let totalPages = (parseInt(propertiesCount.length) / parseInt(count))

        totalPages = Number.isInteger(totalPages) ? totalPages : parseInt(totalPages) + 1

        return Response.sendResponse(
            res, {
            msg: '504',
            data: {
                property: allProperties,
                page: page,
                count: parseInt(propertiesCount.length),
                totalPages: totalPages
            },
            lang: req.params.lang
        });
    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });

    }

}

// Find All Archived Properties With Agent Id
const findAllDraftPropertiesWithAgent = async (req, res, next) => {
    const { page, count } = req.params
    // const {agentId} = req.query

    try {
        const all_property = await Prisma.Property.findMany({
            take: parseInt(count),
            skip: (parseInt(page) - 1) * parseInt(count),
            where: {
                status: 0,
                teamMemberId: parseInt(req.query.agentId)
            },
            include: {
                amenities: {
                    include: {
                        amenities: true
                    }
                },
                specification: {
                    include: {
                        specification: true
                    }
                },
                nearBy: true,
                images: true,
            },
            orderBy: {
                createdAt: req.query.sorting
            }
        });
        let allProperties = all_property.map((prop) => {
            return {
                ...prop,
            }
        })
        const propertiesCount = await Prisma.Property.findMany({
            where: {
                status: 0,
                teamMemberId: parseInt(req.query.agentId)
            }
        });
        let totalPages = (parseInt(propertiesCount.length) / parseInt(count))

        totalPages = Number.isInteger(totalPages) ? totalPages : parseInt(totalPages) + 1

        return Response.sendResponse(
            res, {
            msg: '504',
            data: {
                property: allProperties,
                page: page,
                count: parseInt(propertiesCount.length),
                totalPages: totalPages
            },
            lang: req.params.lang
        });
    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });

    }

}

//Find All Ameneties
const findAllAmenities = async (req, res, next) => {
    try {
        const all_property = await Prisma.Amenities.findMany();
        return Response.sendResponse(
            res, {
            msg: '506',
            data: {
                Amenities: all_property,
            },
            lang: req.params.lang
        });
    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });

    }
}

const findAllSpecification = async (req, res, next) => {
    try {
        const all_property = await Prisma.Specification.findMany({});
        return Response.sendResponse(
            res, {
            msg: '507',
            data: {
                Specification: all_property,
            },
            lang: req.params.lang
        });
    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });

    }
}

const updateProperty = async (req, res, next) => {
    try {
        let { amenetiesIds, specificationIds, nearBy, images, areaId, countryId, cityId, developerId } = req.body;
        // console.log(req.user)


        const isRent = req.body.isrent

        // Set isBuy based on isRent
        const isBuy = !isRent;


        const where = {
            id: parseInt(req.params.id),
        };

        let check_property = await Prisma.Property.findUnique({
            where,

        })
        console.log(check_property)


        // if (req.user.id !== check_property.teamMemberId) {
        //     return next({ msg: 506 });
        // }

        const property = {
            title: req.body.title || undefined,
            projectId: req.body.projectId || undefined,

            description: req.body.description || undefined,
            propertyRef: req.body.propertyRef || undefined,
            propertyType: req.body.propertyType || undefined,
            propertyPrice: req.body.propertyPrice || undefined,

            share: req.body.share || undefined,
            liked: req.body.liked || undefined,
            followed: req.body.followed || undefined,
            saved: req.body.saved || undefined,

            isrent: isRent,
            isbuy: isBuy,

            lat: req.body.lat || undefined,
            lon: req.body.lon || undefined,

            // city: req.body.city || undefined,
            zipCode: req.body.zipCode || undefined,
            // country: req.body.country || undefined,
            address: req.body.address || undefined,
            phone: req.body.phone || undefined,

            videoUrl: req.body.videoUrl || undefined,
            facebook: req.body.facebook || undefined,
            linkedin: req.body.linkedin || undefined,
            twitter: req.body.twitter || undefined,

            averagePropertyLink: req.body.averagePropertyLink || undefined,
            propertySalesLink: req.body.propertySalesLink || undefined,

            currency: req.body.currency || undefined,
            area: req.body.area || undefined,
            // teamMemberId: req.body.teamMemberId && req.body.teamMemberId != -1 ? parseInt(req.body.teamMemberId):parseInt(req.user.id),
            teamMember: {
                connect: {
                    id: req.body.teamMemberId && req.body.teamMemberId != -1 ? parseInt(req.body.teamMemberId):parseInt(req.user.id)
                },
            },
        };
        property.city = {
            connect: {
                id: parseInt(cityId)
            }
        }
        property.country = {
            connect: {
                id: parseInt(countryId)
            }
        }
        property.areaPlace = {
            connect: {
                id: parseInt(areaId)
            }
        }
        property.developer = {
            connect: {
                id: parseInt(developerId)
            }
        }

        const updated_property = await Prisma.Property.update({
            where,
            data:
                property,
            include: {
                areaPlace: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                developer: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                city: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                country: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                specification: {
                    include: {
                        specification: true
                    }
                },
                amenities: {
                    include: {
                        amenities: true
                    }
                },
                teamMember: {
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
                        // areaId: true,
                    }
                },
            }
        });

        if (amenetiesIds && amenetiesIds.length > 0) {
            await Prisma.AmenitiesProperties.deleteMany({
                where: {
                    propertyId: parseInt(req.params.id),
                },
            });
            let newAmeneties = amenetiesIds.map(item => {
                return {
                    AmenitiesId: parseInt(item),
                    propertyId: parseInt(req.params.id)
                }
            });
            let multiple = await Prisma.AmenitiesProperties.createMany({
                data: newAmeneties,
                // skipDuplicates: true,
            });

        }

        if (specificationIds && specificationIds.length > 0) {
            await Prisma.SpecificationProperties.deleteMany({
                where: {
                    propertyId: parseInt(req.params.id),
                },
            });
            let newASpecifications = specificationIds.map(item => {
                return {
                    SpecificationId: parseInt(item.id),
                    answer: item.answer,
                    propertyId: parseInt(req.params.id)
                }
            });
            let multiple = await Prisma.SpecificationProperties.createMany({
                data: newASpecifications,
                // skipDuplicates: true,
            });
        }

        if (images && images.length > 0) {
            await Prisma.PropertyImages.deleteMany({
                where: {
                    propertyId: parseInt(req.params.id),
                },
            });
            images = images.map(item => {
                return {
                    link: item,
                    propertyId: parseInt(req.params.id)
                }
            });
            let multiple = await Prisma.PropertyImages.createMany({
                data: images,
                // skipDuplicates: true,
            });
        }

        if (nearBy && nearBy.length > 0) {
            await Prisma.NearBy.deleteMany({
                where: {
                    propertyId: parseInt(req.params.id),
                }
            })
            nearBy = nearBy.map(item => {
                return {
                    name: item.name || undefined,
                    description: item.description || undefined,
                    ratings: parseFloat(item.ratings) || undefined,
                    propertyId: parseInt(req.params.id)
                }
            })

            let multiple = await Prisma.NearBy.createMany({
                data: nearBy,
                // skipDuplicates: true,
            });
        }

        return Response.sendResponse(
            res, {
            msg: '501',
            data: {
                property: updated_property,
            },
            lang: req.params.lang
        });
    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });
    }
}

const updatePropertyDraft = async (req, res, next) => {
    try {
        let { amenetiesIds, specificationIds, nearBy, images, areaId, countryId, cityId, developerId } = req.body;
        // console.log(req.user)


        const isRent = req.body.isrent

        // Set isBuy based on isRent
        const isBuy = !isRent;


        const where = {
            id: parseInt(req.params.id),
        };

        let check_property = await Prisma.Property.findUnique({
            where,

        })
        console.log(check_property)


        // if (req.user.id !== check_property.teamMemberId) {
        //     return next({ msg: 506 });
        // }

        const property = {
            title: req.body.title || undefined,
            projectId: req.body.projectId || undefined,

            description: req.body.description || undefined,
            propertyRef: req.body.propertyRef || undefined,
            propertyType: req.body.propertyType || undefined,
            propertyPrice: req.body.propertyPrice || undefined,

            share: req.body.share || undefined,
            liked: req.body.liked || undefined,
            followed: req.body.followed || undefined,
            saved: req.body.saved || undefined,

            isrent: isRent,
            isbuy: isBuy,
            status:0,
            lat: req.body.lat || undefined,
            lon: req.body.lon || undefined,

            // city: req.body.city || undefined,
            zipCode: req.body.zipCode || undefined,
            // country: req.body.country || undefined,
            address: req.body.address || undefined,
            phone: req.body.phone || undefined,

            videoUrl: req.body.videoUrl || undefined,
            facebook: req.body.facebook || undefined,
            linkedin: req.body.linkedin || undefined,
            twitter: req.body.twitter || undefined,

            averagePropertyLink: req.body.averagePropertyLink || undefined,
            propertySalesLink: req.body.propertySalesLink || undefined,

            currency: req.body.currency || undefined,
            area: req.body.area || undefined,
            teamMemberId: req.body.teamMemberId || undefined
        };
        property.city = {
            connect: {
                id: parseInt(cityId)
            }
        }
        property.country = {
            connect: {
                id: parseInt(countryId)
            }
        }
        property.areaPlace = {
            connect: {
                id: parseInt(areaId)
            }
        }
        property.developer = {
            connect: {
                id: parseInt(developerId)
            }
        }

        const updated_property = await Prisma.Property.update({
            where,
            data:
                property,
            include: {
                areaPlace: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                developer: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                city: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                country: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                specification: {
                    include: {
                        specification: true
                    }
                },
                amenities: {
                    include: {
                        amenities: true
                    }
                },
                teamMember: {
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
                        // areaId: true,
                    }
                },
            }
        });

        if (amenetiesIds && amenetiesIds.length > 0) {
            await Prisma.AmenitiesProperties.deleteMany({
                where: {
                    propertyId: parseInt(req.params.id),
                },
            });
            let newAmeneties = amenetiesIds.map(item => {
                return {
                    AmenitiesId: parseInt(item),
                    propertyId: parseInt(req.params.id)
                }
            });
            let multiple = await Prisma.AmenitiesProperties.createMany({
                data: newAmeneties,
                // skipDuplicates: true,
            });

        }

        if (specificationIds && specificationIds.length > 0) {
            await Prisma.SpecificationProperties.deleteMany({
                where: {
                    propertyId: parseInt(req.params.id),
                },
            });
            let newASpecifications = specificationIds.map(item => {
                return {
                    SpecificationId: parseInt(item.id),
                    answer: item.answer,
                    propertyId: parseInt(req.params.id)
                }
            });
            let multiple = await Prisma.SpecificationProperties.createMany({
                data: newASpecifications,
                // skipDuplicates: true,
            });
        }

        if (images && images.length > 0) {
            await Prisma.PropertyImages.deleteMany({
                where: {
                    propertyId: parseInt(req.params.id),
                },
            });
            images = images.map(item => {
                return {
                    link: item,
                    propertyId: parseInt(req.params.id)
                }
            });
            let multiple = await Prisma.PropertyImages.createMany({
                data: images,
                // skipDuplicates: true,
            });
        }

        if (nearBy && nearBy.length > 0) {
            await Prisma.NearBy.deleteMany({
                where: {
                    propertyId: parseInt(req.params.id),
                }
            })
            nearBy = nearBy.map(item => {
                return {
                    name: item.name || undefined,
                    description: item.description || undefined,
                    ratings: parseFloat(item.ratings) || undefined,
                    propertyId: parseInt(req.params.id)
                }
            })

            let multiple = await Prisma.NearBy.createMany({
                data: nearBy,
                // skipDuplicates: true,
            });
        }

        return Response.sendResponse(
            res, {
            msg: '501',
            data: {
                property: updated_property,
            },
            lang: req.params.lang
        });
    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });
    }
}

const publishPropertyDraft = async (req, res, next) => {
    try {
        const where = {
            id: parseInt(req.params.id),
        };

        
       


        // if (req.user.id !== check_property.teamMemberId) {
        //     return next({ msg: 506 });
        // }


        const updated_property = await Prisma.Property.update({
            where,
            data:
                {
                    status:1
                },
            include: {
                areaPlace: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                developer: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                city: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                country: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                specification: {
                    include: {
                        specification: true
                    }
                },
                amenities: {
                    include: {
                        amenities: true
                    }
                },
                teamMember: {
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
                        // areaId: true,
                    }
                },
            }
        });

        

        return Response.sendResponse(
            res, {
            msg: '501',
            data: {
                property: updated_property,
            },
            lang: req.params.lang
        });
    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });
    }
}

//delete Property
const deleteProperty = async (req, res, next) => {
    try {
        const selector = {
            where: {
                id: parseInt(req.params.id),
            },
            data: {
                status: 0
            }
        };
        const deleted_property = await Prisma.Property.update(selector);
        return Response.sendResponse(
            res, {
            msg: '502',
            data: {
                property: deleted_property,
            },
            lang: req.params.lang
        });

    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });
    }
}

//delete Property
const updatePropertyImage = async (req, res, next) => {
    try {
        const selector = {
            where: {
                id: parseInt(req.params.id),
            },
            data: {
                link: req.body.link
            }
        };
        const deleted_property = await Prisma.PropertyImages.update(selector);
        return Response.sendResponse(
            res, {
            msg: '501',
            data: {
                propertyImage: deleted_property,
            },
            lang: req.params.lang
        });

    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });
    }
}

//delete Property
const deletePropertyImage = async (req, res, next) => {
    try {
        const selector = {
            where: {
                id: parseInt(req.params.id),
            }
        };
        const deleted_property = await Prisma.PropertyImages.delete(selector);
        return Response.sendResponse(
            res, {
            msg: '502',
            data: {
                propertyImage: deleted_property,
            },
            lang: req.params.lang
        });

    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });
    }
}

const nearByUpdate = async (req, res, next) => {
    try {
        const selector = {
            where: {
                id: parseInt(req.params.id),
            },
            data: {
                name: req.body.name || undefined,
                description: req.body.description || undefined,
                ratings: req.body.ratings || undefined
            }
        };
        const deleted_property = await Prisma.NearBy.update(selector);
        return Response.sendResponse(
            res, {
            msg: '501',
            data: {
                nearBy: deleted_property,
            },
            lang: req.params.lang
        });

    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });
    }
}

const nearByUpdateMany = async (req, res, next) => {
    try {
        await Prisma.NearBy.deleteMany({
            where: {
                propertyId: parseInt(req.params.id),
            },
        });
        req.body.nearBy.forEach((loc) => {
            // console.log(loc)
        })
        let nearBy = req.body.nearBy.map(item => {
            return {
                name: item.name || undefined,
                description: item.description || undefined,
                ratings: parseFloat(item.ratings) || undefined,
                propertyId: parseInt(req.params.id)
            }
        });
        // console.log("nearBy", nearBy);
        let newNearBy = await Prisma.NearBy.createMany({
            data: nearBy,
        });
        // const selector = {
        //     where: {
        //         id: parseInt(req.params.id),
        //     },
        //     data: {
        //         name: req.body.name || undefined,
        //         description: req.body.description || undefined,
        //         ratings: req.body.ratings || undefined
        //     }
        // };
        // const deleted_property = await Prisma.NearBy.update(selector);
        return Response.sendResponse(
            res, {
            msg: '508',
            data: {
                nearBy: newNearBy,
            },
            lang: req.params.lang
        });

    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });
    }
}

const nearByDelete = async (req, res, next) => {
    try {
        const selector = {
            where: {
                id: parseInt(req.params.id),
            }
        };
        const deleted_property = await Prisma.NearBy.delete(selector);
        return Response.sendResponse(
            res, {
            msg: '502',
            data: {
                propertyImage: deleted_property,
            },
            lang: req.params.lang
        });

    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });
    }
}

const getSearchResults = async (req,res,next) => {
    let {search} = req.query; 
    search = search?.trim() ?? "";

    try{
        

        const property = await Prisma.property.findMany({
            where:{
               OR:[
                {city:{
                    name:
                    {
                    contains:search
                    }
                    
                }},
                {address:{contains:search}},
               { areaPlace:{name:{contains:search}}},
                
               ],
               status:1
                
            },
            include:{
                areaPlace:{
                    select:{
                        name:true
                    }
                },
                city:{
                    select:{
                        name:true
                    }
                },
            }
        })

        let totalArr = [];

        if(property.length > 0){
            const areas = Array.from(new Set(property.map(({areaPlace}) => areaPlace?.name)))
            const cities = Array.from(new Set(property.map(({city}) => city?.name)))
            // const titles = Array.from(new Set(property.map(({title}) => title)));
            const addresses = Array.from(new Set(property.map(({address}) => address)));

            totalArr = [...areas,...cities,...addresses];
        }

        return Response.sendResponse(
            res, {
            msg: '517',
            data: {
                searchResults:totalArr
            },
            lang: req.params.lang
        });
        
    }catch(e){
        console.log(e);
        return next({ msg: 3067 })
    }
}

const searchProperty = async (req, res, next) => {


    const { search, currency, lat, lon,
        type, minPrice, maxPrice, minBedrooms, maxBedrooms, propertyType,
        minArea, maxArea, features, agent,
        isFeature, cityId, countryId, areaId, startDate, endDate,developerId
    } = req.query;
    const { count, page, sort } = req.params

    // if(!lat || !lon || !type) {
    //     return next({ msg: 505 })
    // }

    // const isBuy = isRent === 'false' ? 'true' : 'false'; // Set isBuy based on isRent
    


    const searchQuery = {

        AND: [
            {
                OR: [
                    {
                        isrent: type === "All Property Status" || type === "For Rent"
                    },
                    {
                        isbuy: type === "All Property Status" || type === "For Buy"
                    }
                ]
            },
            // { lat:  parseFloat(lat) },
            // { lon:  parseFloat(lon) },
           
           
        ]
    };

    
    

    if(search && search?.length > 0){
        searchQuery.AND.push({
            
                OR: [
                    { title: { in:search} },
                    { description: { in: search } },
                    { address: { in: search}  },
                    { city: { name:{in: search } }},
                    {areaPlace:{name:{in:search}}}
                ]
            
        })
    }

    if (cityId && cityId != 0) {
        searchQuery.AND.push({
            cityId: parseInt(cityId)
        })
    }

    if (countryId && countryId != 0) {
        searchQuery.AND.push({
            countryId: parseInt(countryId)
        })
    }

    if (areaId && areaId != 0) {
        searchQuery.AND.push({
            areaId: parseInt(areaId)
        })
    }

    if (startDate && endDate) {
        searchQuery.AND.push({
            createdAt: { gte: new Date(startDate), lte: new Date(endDate) },
        })
    }


    if (minPrice || maxPrice) {
        if(minPrice && maxPrice)
        searchQuery.AND.push({
            propertyPrice: { gte: parseFloat(minPrice), lte: parseFloat(maxPrice) },
        })

        else if(minPrice) searchQuery.AND.push({
            propertyPrice: { gte: parseFloat(minPrice) },
        })

        else if(maxPrice) searchQuery.AND.push({
            propertyPrice: { lte: parseFloat(maxPrice) },
        })
    }

    if (agent) {
        searchQuery.AND.push({
            teamMember: {

                OR: [
                    { id: parseInt(agent) }
                ],

            },
        });
    }

    
    if (minBedrooms && minBedrooms != "Studio") {
        let noOfBedrooms = []
       
        for (let i = 0; i < parseInt(minBedrooms); i++) {
            noOfBedrooms.push(i.toString())
        }
        searchQuery.AND.push({
            specification: {
                some: {
                    AND: [
                        { specification: { key: {in:['Bedroom',"Rooms"]} } },
                        { answer: { notIn: [...noOfBedrooms,"Studio"] } },
                    ],
                },
            },
        });
    }

    if (maxBedrooms) {
        if(maxBedrooms == "Studio") searchQuery.AND.push({
            specification: {
                some: {
                    AND: [
                        { specification: { key: {in:['Bedroom',"Rooms"]} } },
                        { answer: "Studio" },
                    ],
                },
            },
        });
        else{
            let noOfBedrooms = []
            
            for (let i = parseInt(maxBedrooms)+1; i <= 100; i++) {
                noOfBedrooms.push(i.toString())
            }
            searchQuery.AND.push({
                specification: {
                    some: {
                        AND: [
                            { specification: { key: {in:['Bedroom',"Rooms"]} } },
                            { answer: { notIn: noOfBedrooms } },
                        ],
                    },
                },
            });
        }
       

        
    }

    if (minArea || maxArea) {
        if(minArea && maxArea)
        searchQuery.AND.push({
            area: {
                gte: parseFloat(minArea),
                lte: parseFloat(maxArea),
            },
        });
        
        else if(minArea)searchQuery.AND.push({
            area: {
                gte: parseFloat(minArea),
               
            },
        });

        else if(maxArea)searchQuery.AND.push({
            area: {
               
                lte: parseFloat(maxArea),
            },
        }); 
    }

    if (propertyType != "All Property") {
        searchQuery.AND.push({
            propertyType: propertyType,
        });
    }

    if (features) {
        searchQuery.AND.push({
            amenities: {
                some: {
                    AND: [
                        { amenities: { key: features } },
                    ]
                }
            }
        })
    }

    if (isFeature) {
        searchQuery.AND.push({
            isFeature: true,
        });
    }

    if(developerId && developerId!=""){
        searchQuery.AND.push({
            developerId:parseInt(developerId)
        })
    }

    let sortObj = {}
    //propertyPrice
    console.log(sort);
    switch(sort){
        case "desc": sortObj = {createdAt:"desc"}
        break
        case "asc": sortObj = {createdAt:"asc"}
        break;
        case "priceDesc": sortObj = {propertyPrice:"desc"}
        break;
        case "priceAsc":sortObj = {propertyPrice:"asc"}
        break
        default: sortObj = {createdAt:"desc"}
    }

    // console.log(JSON.stringify(searchQuery));
    try {
        const properties = await Prisma.Property.findMany({
            take: parseInt(count),
            skip: (parseInt(page) - 1) * parseInt(count),
            where: {
                ...searchQuery,
                status: 1,
                
                
            },
            include: {
                areaPlace: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                developer: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                city: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                country: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                amenities: {
                    include: {
                        amenities: true
                    }
                },
                specification: {
                    include: {
                        specification: true
                    }
                },
                nearBy: true,
                images: true,
                teamMember: {
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
                        // areaId: true,
                    }
                },
            },
            orderBy: sortObj
        });
        // all field has same filtering
        const propertiesCount = await Prisma.Property.findMany({

            where: {
                ...searchQuery,
                status: 1,
            },
            include: {
                amenities: {
                    include: {
                        amenities: true
                    }
                },
                specification: true,
                nearBy: true,
                images: true,
                teamMember: true
            },
        });


        
        let totalPages = (parseInt(propertiesCount.length) / parseInt(count))

        totalPages = Number.isInteger(totalPages) ? totalPages : parseInt(totalPages) + 1
        return Response.sendResponse(
            res, {
            msg: '509',
            data: {
                properties: properties,
                page: page,
                count: parseInt(propertiesCount.length),
                totalPages: totalPages
            },
            lang: req.params.lang
        });

    } catch (err) {
        console.log("error",err);
        return next({ msg: 3067 })
    }
}

const sendPropertyEmail = async (req, res, next) => {
    try {
        const selector = {
            where: {
                id: parseInt(req.params.id),
                status: 1,
            },
            include: {
                images: true,
                teamMember: true
            }
        };
        const foundProperty = await Prisma.Property.findFirst(selector);

        if (!foundProperty) {
            return next({ msg: 503 })
        }
        // ejs.renderFile(
        //     path.join(process.cwd(), "/templates/emails/propertyDetails.ejs"),
        //     {
        //       serverurl: config.backendAssetsUrl,
        //       property: foundProperty,
        //       customer: req.body
        //     },
        //     function (err, data) {
        //       if (err) {
        //         console.log(err);
        //       } else {
        //         var mainOptions = {
        //           from: "Homes and Beyond <info@homesandbeyond.com.tr>",
        //           to: "jawad@leadvy.com",
        //           bcc: "mezalden@vousagency.com,jawad@vousagency.com",
        //           subject: "Homes and Byond Request form for "+ foundProperty.title,
        //           html: data,
        //         };
        //         let SendEmail = transporter();
        //         SendEmail.sendMail(mainOptions, function (err, info) {
        //           if (err) {
        //             console.log(err);
        //           } else {
        //             console.log("Message sent: " + info.response);
        //           }
        //         });
        //       }
        //     }
        // );
        sendEmail(null, null, [req.body.email, foundProperty.teamMember.email], "propertyDetails",
            {
                backendAssetsUrl: config.backendAssetsUrl,
                property: foundProperty,
                customer: req.body
            },
            "Homes and Beyond Request form for " + foundProperty.title
        )
        
        return Response.sendResponse(
            res, {
            msg: '515',
            data: {
                foundProperty: foundProperty,
            },
            lang: req.params.lang
        });


    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });
    }
}

const preload = async (req, res, next) => {
    try {
        const propertyTypes = [
            "Apartment",
            "Villa",
            "Townhouse",
            "Hotel Apartment",
            "Duplex",
            "Penthouse",
            "Mansion",
            "Office",
            "Shop",
            "Residential Plot",
            "Commercial Plot"
        ]

        return Response.sendResponse(
            res, {
            msg: '510',
            data: {
                propertyTypes: propertyTypes,
            },
            lang: req.params.lang
        });
    } catch (err) {
        console.log(err);
        return next({ msg: 3067 })
    }
}

const setIsPropertyOfDayTrue = async (req, res, next) => {
    const { isPropertyOfTheDay } = req.body
    const { id } = req.params

    try {

        const existProp = await Prisma.Property.findFirst({
            where: {
                id: parseInt(id),
                status: 1
            }
        })

        if (existProp) {
            const updateSet = await Prisma.Property.updateMany({
                where: {
                    isPropertyOfTheDay: true
                },
                data: {
                    isPropertyOfTheDay: false
                }
            })

            const data = await Prisma.Property.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    isPropertyOfTheDay,
                }
            })
            return Response.sendResponse(
                res, {
                msg: '512',
                data: {
                    data: data,
                },
                lang: req.params.lang
            });
        } else {
            return Response.sendResponse(
                res, {
                msg: '511',
                data: {
                    data: existProp,
                },
                lang: req.params.lang
            });
        }
    } catch (err) {
        console.log(err);
        return next({ msg: 3067 })
    }
}

const isFeature = async (req, res, next) => {
    const { id } = req.params
    const { isFeature } = req.body

    try {
        const existProp = await Prisma.Property.findFirst({
            where: {
                id: parseInt(id),
                status: 1
            }
        })

        if (existProp) {
            const data = await Prisma.Property.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    isFeature
                }
            })

            return Response.sendResponse(
                res, {
                msg: '513',
                data: {
                    data: data,
                },
                lang: req.params.lang
            });
        } else {
            return Response.sendResponse(
                res, {
                msg: '511',
                data: {
                    data: existProp,
                },
                lang: req.params.lang
            });
        }
    } catch (err) {
        console.log(err);
        return next({ msg: 3067 })
    }

}

const getPropertiesByType = async (req, res, next) => {
    try {
        let propertyTypes = global.config.propertyTypes
        let data = []
        for (let i = 0; i < propertyTypes.length; i++) {
            let properties = await Prisma.property.findMany({
                where: {
                    status: 1,
                    propertyType: propertyTypes[i]
                },
                include: {
                    amenities: {
                        include: {
                            amenities: true
                        }
                    },
                    specification: {
                        include: {
                            specification: true
                        }
                    },
                    city:true,
                    areaPlace: true,
                    nearBy: true,
                    images: true,
                    teamMember: true
                },
            })
            data.push({
                name: propertyTypes[i],
                properties
            })
            // console.log({
            //     name: propertyTypes[i],
            //     properties: properties.length
            // })
        }

        return Response.sendResponse(
            res, {
            msg: '514',
            data: {
                data: data,
            },
            lang: req.params.lang
        });
    } catch (err) {
        console.log(err);
        return next({ msg: 3067 })
    }

}

const getPropertiesCountByCity = async (req, res, next) => {
    try {
        let cities = await Prisma.property.groupBy({
            by: ['city'],
            where: {
                status: 1,
            },
            _count: {
                _all: true
            },
            orderBy: {
                city: 'desc'
            },

        })

        return Response.sendResponse(
            res, {
            msg: '514',
            data: {
                cities: cities,
            },
            lang: req.params.lang
        });
    } catch (err) {
        console.log(err);
        return next({ msg: 3067 })
    }

}

const getAllByName = async (req, res, next) =>{
    const {name} = req.params

    try{
        const properties = await Prisma.Property.findMany({
            where:{
                title: {
                    contains: name
                }
            }
        })
        return Response.sendResponse(
            res, {
            msg: '514',
            data: {
                properties: properties,
            },
            lang: req.params.lang
        });
    }catch(err){
        console.log(err);
        return next({ msg: 3067 })
    }
}

const getAllByArea = async (req, res, next) =>{
    const {areaId} = req.params
    const {count} = req.query;
    let query = {};
    if(count && count != "") query = {take:parseInt(count)}

    try{
        const properties = await Prisma.Property.findMany({
            ...query,
            where:{
                areaId: parseInt(areaId)
            },
            include:{
                images: true,
                specification: {
                    include: {
                        specification: true
                    }
                },
                areaPlace:true,
                teamMember: true
            },
            orderBy:{
                createdAt: "desc"
            }
        })
        return Response.sendResponse(
            res, {
            msg: '514',
            data: {
                properties: properties,
            },
            lang: req.params.lang
        });
    }catch(err){
        console.log(err);
        return next({ msg: 3067 })
    }
}

const getAllPropertiesByIds = async(req,res,next) => {
    try{
        const {id} = req.query
        let arrIds = id && id?.length > 0 ? id : []
        
            const properties = await Prisma.property.findMany({
                where:{
                    id:{in:arrIds?.map((id) => parseInt(id))}
                },
                include:{
                    specification:{
                        include:{
                            specification:true
                        }
                    },
                    images:true,
                    teamMember:true,
                    areaPlace:true
                }
            });

            return Response.sendResponse(
                res, {
                msg: '509',
                data: {
                    properties: properties,
                },
                lang: req.params.lang
            });

        
    }catch(err){
        console.log(err);
        return next({ msg: 3067 })
    }
}

module.exports = {
    createProperty,
    addAmenitiesAndSpecifications,
    findOneProperty,
    findAllProperty,
    findAllPropertiesWithAgent,
    updateProperty,
    deleteProperty,
    updatePropertyImage,
    deletePropertyImage,
    nearByDelete,
    nearByUpdate,
    nearByUpdateMany,
    findAllAmenities,
    findAllSpecification,
    searchProperty,
    sendPropertyEmail,
    preload,
    setIsPropertyOfDayTrue,
    isFeature,
    propertyOfDay,
    getPropertiesByType,
    getPropertiesCountByCity,
    findOnePropertyById,
    getAllByName,
    getAllByArea,
    findAllDraftPropertiesWithAgent,
    findOneDraftPropertyById,
    updatePropertyDraft,
    publishPropertyDraft,
    getSearchResults,
    getAllPropertiesByIds,
    findOnePropertyByNameAndArea
};
