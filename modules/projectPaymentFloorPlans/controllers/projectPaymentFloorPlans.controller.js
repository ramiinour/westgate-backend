const { PrismaClient, Prisma } = require("@prisma/client")
const Response = require("../../../configuration/config.response")
const { sendEmail } = require("../../../configuration/config.mailer")

const prisma = new PrismaClient({
    log: ['error']
})

const getAllProjectPaymentFloorPlan = async (req, res, next) => {
    const { page, count, sort } = req.params

    try {
        const allProjectsData = await prisma.project.findMany({
            take: parseInt(count),
            skip: (parseInt(page) - 1) * parseInt(count),

            where: { status: 1 },
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
                projectPaymentPlans: {
                    include: {
                        paymentPlan: true
                    }
                },
                projectFloorPlans: {
                    include: {
                        floorPlan: true,
                        imagesFloorPlans: true,
                    }
                },
                ImagesProject: true,
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
                amenities: {
                    include: {
                        amenities: true
                    }
                },
                mainImagesProject: true
            },
            orderBy: {
                createdAt: sort
            }
        });

        let allProjects = allProjectsData.map((project) => {
            return {
                ...project,
            }
        })
        const projectCount = await prisma.project.findMany({
            where: {
                status: 1
            }
        });


        let totalPages = (parseInt(projectCount.length) / parseInt(count))

        totalPages = Number.isInteger(totalPages) ? totalPages : parseInt(totalPages) + 1

        return Response.sendResponse(res, {
            msg: '903',
            data:
            {
                projects: allProjects,
                projectTypes: global.config.projectTypes,
                unitTypes: global.config.unitTypes,
                page: page,
                count: projectCount.length,
                totalPages: totalPages

            },
            lang: req.params.lang
        });
    } catch (err) {
        console.log(err)
        return next({ msg: 3067 });
    }

}

const getOneProjectPaymentFloorPlanById = async (req, res, next) => {
    const { id } = req.params
    // const { agentId } = req.query
    try {
        const data = await prisma.project.findFirst({
            where: { status: 1, id: parseInt(id) },
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
                projectPaymentPlans: {
                    include: {
                        paymentPlan: true
                    }
                },
                projectFloorPlans: {
                    include: {
                        floorPlan: true,
                        imagesFloorPlans: true,
                    }
                },
                ImagesProject: true,
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
                amenities: {
                    include: {
                        amenities: true
                    }
                },
                mainImagesProject: true
            }
        });
        if (data) {
            return Response.sendResponse(res, {
                msg: '903',
                data: data,
                projectTypes: global.config.projectTypes,
                unitTypes: global.config.unitTypes,
                lang: req.params.lang
            });
        } else {
            return res.status(400).json({
                "success": 0,
                "message": "project Does Not Exist",
                "response": 400,
                "data": {}
            })
        }
    } catch (err) {
        console.log(err)
        return next({ msg: 3067 });
    }

}

const getOneProjectPaymentFloorPlan = async (req, res, next) => {
    const { name } = req.params
    // const { agentId } = req.query
    try {

        const project = await prisma.project.findUnique({
            where: {
                title: name
            }
        });
        
        if (!project) {
            return res.status(500).json({
                "success": 0,
                "message": "Project Does Not Exist",
                "response": 500,
                "data": {}
            })
        }

        const data = await prisma.project.findFirst({
            where: { status: 1, id: parseInt(project.id) },
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
                projectPaymentPlans: {
                    include: {
                        paymentPlan: true
                    }
                },
                projectFloorPlans: {
                    include: {
                        floorPlan: true,
                        imagesFloorPlans: true,
                    }
                },
                ImagesProject: true,
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
                amenities: {
                    include: {
                        amenities: true
                    }
                },
                mainImagesProject: true
            }
        });
        if (data) {
            return Response.sendResponse(res, {
                msg: '903',
                data: data,
                projectTypes: global.config.projectTypes,
                unitTypes: global.config.unitTypes,
                lang: req.params.lang
            });
        } else {
            return res.status(400).json({
                "success": 0,
                "message": "project Does Not Exist",
                "response": 400,
                "data": {}
            })
        }
    } catch (err) {
        console.log(err)
        return next({ msg: 3067 });
    }

}

const getAllProjectPaymentFloorPlanByAgent = async (req, res, next) => {
    const { agentId } = req.query
    const { count, page, sort } = req.params

    try {
        const data = await prisma.project.findMany({
            take: parseInt(count),
            skip: (parseInt(page) - 1) * parseInt(count),
            where: {
                status: 1, teamMemberId: parseInt(agentId)
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
                projectPaymentPlans: true,
                projectFloorPlans: {
                    include: {
                        floorPlan: true,
                        imagesFloorPlans: true,
                    }
                },
                ImagesProject: true,
                mainImagesProject: true
            },
            orderBy: {
                createdAt: sort
            }
        });
        if (data) {


            let allProjects = data.map((project) => {
                return {
                    ...project,
                }
            })
            const projectCount = await prisma.project.findMany({
                where: {
                    status: 1, teamMemberId: parseInt(agentId)
                }
            });


            let totalPages = (parseInt(projectCount.length) / parseInt(count))

            totalPages = Number.isInteger(totalPages) ? totalPages : parseInt(totalPages) + 1

            return Response.sendResponse(res, {
                msg: '903',
                data:
                {
                    projects: allProjects,
                    projectTypes: global.config.projectTypes,
                    unitTypes: global.config.unitTypes,
                    page: page,
                    count: projectCount.length,
                    totalPages: totalPages

                },
            });


        } else {
            return res.status(400).json({
                "success": 0,
                "message": "agnet Does Not Exist",
                "response": 400,
                "data": {}
            })
        }
    } catch (err) {
        console.log(err)
        return next({ msg: 3067 });
    }

}

const getAllProjectPaymentFloorPlanByArea = async (req, res, next) => {
    const { areaId } = req.query
    const { count, page, sort } = req.params

    try {
        const data = await prisma.project.findMany({
            take: parseInt(count),
            skip: (parseInt(page) - 1) * parseInt(count),
            where: {
                status: 1, areaId: parseInt(areaId)
            },
            include: {
                teamMember: {
                   select: {
                    id:true,
                    firstName:true,
                    lastName:true,
                    cellNumber:true,
                    languages: true,
                   }
                },
                // areaPlace: {
                //     select: {
                //         id: true,
                //         name: true
                //     }
                // },
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
                projectPaymentPlans: true,
                projectFloorPlans: {
                    include: {
                        floorPlan: true,
                        imagesFloorPlans: true,
                    }
                },
                ImagesProject: true,
                mainImagesProject: true
            },
            orderBy: {
                createdAt: sort
            }
        });
        if (data) {

            let allProjects = data.map((project) => {
                return {
                    ...project,
                }
            })
            const projectCount = await prisma.project.findMany({
                where: {
                    status: 1, areaId: parseInt(areaId)
                }
            });


            let totalPages = (parseInt(projectCount.length) / parseInt(count))

            totalPages = Number.isInteger(totalPages) ? totalPages : parseInt(totalPages) + 1

            return Response.sendResponse(res, {
                msg: '903',
                data:
                {
                    projects: allProjects,
                    projectTypes: global.config.projectTypes,
                    unitTypes: global.config.unitTypes,
                    page: page,
                    count: projectCount.length,
                    totalPages: totalPages

                },
            });


        } else {
            return res.status(400).json({
                "success": 0,
                "message": "area Does Not Exist",
                "response": 400,
                "data": {}
            })
        }
    } catch (err) {
        console.log(err)
        return next({ msg: 3067 });
    }

}


const getAllProjectPaymentFloorPlanByAgentDraft = async (req, res, next) => {
    const { agentId } = req.query
    const { count, page, sort } = req.params

    try {
        const data = await prisma.project.findMany({
            take: parseInt(count),
            skip: (parseInt(page) - 1) * parseInt(count),
            where: {
                status: 0, teamMemberId: parseInt(agentId)
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
                projectPaymentPlans: true,
                projectFloorPlans: {
                    include: {
                        floorPlan: true,
                        imagesFloorPlans: true,
                    }
                },
                ImagesProject: true,
                mainImagesProject: true
            },
            orderBy: {
                createdAt: sort
            }
        });
        if (data) {


            let allProjects = data.map((project) => {
                return {
                    ...project,
                }
            })
            const projectCount = await prisma.project.findMany({
                where: {
                    status: 0, teamMemberId: parseInt(agentId)
                }
            });


            let totalPages = (parseInt(projectCount.length) / parseInt(count))

            totalPages = Number.isInteger(totalPages) ? totalPages : parseInt(totalPages) + 1

            return Response.sendResponse(res, {
                msg: '903',
                data:
                {
                    projects: allProjects,
                    projectTypes: global.config.projectTypes,
                    unitTypes: global.config.unitTypes,
                    page: page,
                    count: projectCount.length,
                    totalPages: totalPages

                },
            });


        } else {
            return res.status(400).json({
                "success": 0,
                "message": "agnet Does Not Exist",
                "response": 400,
                "data": {}
            })
        }
    } catch (err) {
        console.log(err)
        return next({ msg: 3067 });
    }

}


const getOneProjectPaymentFloorPlanByIdDraft = async (req, res, next) => {
    const { id } = req.params
    // const { agentId } = req.query
    try {
        const data = await prisma.project.findFirst({
            where: { status: 0, id: parseInt(id) },
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
                projectPaymentPlans: {
                    include: {
                        paymentPlan: true
                    }
                },
                projectFloorPlans: {
                    include: {
                        floorPlan: true,
                        imagesFloorPlans: true,
                    }
                },
                ImagesProject: true,
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
                amenities: {
                    include: {
                        amenities: true
                    }
                },
                mainImagesProject: true
            }
        });
        if (data) {
            return Response.sendResponse(res, {
                msg: '903',
                data: data,
                projectTypes: global.config.projectTypes,
                unitTypes: global.config.unitTypes,
                lang: req.params.lang
            });
        } else {
            return res.status(400).json({
                "success": 0,
                "message": "project Does Not Exist",
                "response": 400,
                "data": {}
            })
        }
    } catch (err) {
        console.log(err)
        return next({ msg: 3067 });
    }

}


const createProjectPaymentFloorPlan = async (req, res, next) => {
    const { floorPlans, paymentPlans, images,
        title,
        description,
        descImage,
        titleImage,
        phone,
        developer,
        lifestyle,
        completionDate,
        titleType,
        attachment,
        city,
        type,
        mainDescription,
        country,
        area,
        // amenitiesDescription,
        paybackDescription,
        lat,
        lon,
        address,
        mainPaymentPlanFirstNumber,
        mainPaymentPlanSecondNumber,
        handOverYear,
        facebook,
        linkedin,
        handOverYearQuarter,
        twitter,
        // mainImage,
        priceDescription,
        status,
        price, currency,
        locationDescription,
        locationDescriptionImagesUrls,
        economicAppealDescription,
        economicAppealImagesUrls,
        brochureUrl,
        floorPlansBrochureUrl,
        videoUrl,
        totalAmountOfUnits,
        amenitiesIds,
        developerId,
        areaId,
        countryId,
        cityId,
        mainImagesProject
    } = req.body



    try {

        let addDeveloper = {};

        if(developerId){
            addDeveloper = {
                developer: {
                    connect: {
                        id: parseInt(developerId)
                    }
                },
            }
        }


        const dataProject = await prisma.project.create({
            data: {
                title: title || null,
                description: description || null,
                descImage: descImage || null,
                titleImage: titleImage || null,
                brochureUrl: brochureUrl || null,
                floorPlansBrochureUrl: floorPlansBrochureUrl || null,
                phone: phone || null,
                // developer: developer || null,
                lifestyle: lifestyle || null,
                // completionDate: completionDate || null,
                titleType: titleType || null,
                attachment: attachment || null,
                city: city || null,
                type: type || null,
                mainDescription: mainDescription || null,
                country: country || null,
                area: area ? parseInt(area) : null,
                // amenitiesDescription: amenitiesDescription || null,
                paybackDescription: paybackDescription || null,
                lat: lat || null,
                lon: lon || null,
                address: address || null,
                mainPaymentPlanFirstNumber: mainPaymentPlanFirstNumber || null,
                mainPaymentPlanSecondNumber: mainPaymentPlanSecondNumber || null,
                handOverYear: handOverYear || null,
                facebook: facebook || null,
                linkedin: linkedin || null,
                handOverYearQuarter: handOverYearQuarter || null,
                twitter: twitter || null,
                // mainImage: mainImage || null,
                priceDescription: priceDescription || null,
                status: parseInt(status) || 1,
                price: price || null,
                currency: currency || null,
                locationDescription: locationDescription || null,
                locationDescriptionImagesUrls: locationDescriptionImagesUrls || null,
                economicAppealDescription: economicAppealDescription || null,
                economicAppealImagesUrls: economicAppealImagesUrls || null,
                // teamMemberId: req.user.id || null,
                videoUrl: videoUrl || "",
                totalAmountOfUnits: totalAmountOfUnits || "1-3BR",
                // teamMemberId: 202 || null,

                teamMember: {
                    connect: {
                        id: req.user.id
                    }
                },

                ...addDeveloper,
                

                areaPlace: {
                    connect: {
                        id: parseInt(areaId)
                    }
                },
                country: {
                    connect: {
                        id: parseInt(countryId)
                    }
                },
                city: {
                    connect: {
                        id: parseInt(cityId)
                    }
                },

                ImagesProject: {
                    create: images.map(i => ({
                        name: i
                    }))
                },
                mainImagesProject: {
                    create: mainImagesProject.map(i => ({
                        image: i
                    }))
                },
                projectPaymentPlans: {
                    create: paymentPlans.map(plan => ({
                        value: plan.value,
                        key: plan.key,
                        paymentPlan: {
                            connect: { id: plan.id }
                        }
                    }))
                },

                projectFloorPlans: {
                    create: floorPlans.map(f => ({
                        unitType: f.unitType,
                        startingPrice: f.startingPrice,
                        area: f.area,
                        floorPlan: {
                            connect: { id: f.id }
                        },
                        imagesFloorPlans: {
                            create: f.images.map(i => ({
                                images: i,
                            }))

                        }
                    })),
                }

            },
        })


        // create amenities in pivot table amenitiesProject
        amenitiesIds.map(async (a) => {
            await prisma.amenitiesProject.create({
                data: {
                    projectid: dataProject.id,
                    AmenitiesId: parseInt(a)
                }
            })
        })


        const data = await prisma.project.findUnique({
            where: {
                id: dataProject.id,
            },
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
                projectPaymentPlans: true,
                projectFloorPlans: {
                    include: {
                        floorPlan: true,
                        imagesFloorPlans: true
                    }
                },
                ImagesProject: true,
                amenities: {
                    include: {
                        amenities: true
                    }
                },
                mainImagesProject: true
            }
        })

        return Response.sendResponse(res, {
            msg: '901',
            data: data,
            lang: req.params.lang
        });

    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });

    }

}

const updateProjectPaymentFloorPlan = async (req, res, next) => {
    const { id } = req.params
    const { mainImagesProject, amenitiesIds, floorPlans, paymentPlans, images, developerId, areaId,
        countryId, cityId,
        ...dataToUpdate
    } = req.body

    console.log(amenitiesIds, floorPlans, paymentPlans, images, developerId, areaId,)

    try {

        // delete all project images 
        const removeImages = await prisma.imagesProject.deleteMany({
            where: { projectId: parseInt(id) }
        })

        // delete all main headers images
        const removePrevMainImage = await prisma.mainImagesProject.deleteMany({
            where: { projectId: parseInt(id) }
        })

        // delete all project floor plans images 
        const removeFloorProjectImages = await prisma.imagesFloorPlans.deleteMany({
            where: {
                projectFloorPlans: {
                    projectId: parseInt(id)
                }
            }
        })

        // delete all project payment plan from pivot table 
        const removePayment = await prisma.projectPaymentPlan.deleteMany({
            where: {
                projectId: parseInt(id)
            }
        })

        // delete all project payment plan from pivot table 
        const removeFloor = await prisma.projectFloorPlan.deleteMany({
            where: {
                projectId: parseInt(id)
            }
        })

        const dataUpdate = await prisma.project.update({
            where: { id: parseInt(id) },
            data: {
                ...dataToUpdate,
                ImagesProject: {
                    create: images.map(i => ({
                        name: i
                    }))
                },
                areaPlace: {
                    connect: {
                        id: parseInt(areaId)
                    }
                },
                country: {
                    connect: {
                        id: parseInt(countryId)
                    }
                },
                city: {
                    connect: {
                        id: parseInt(cityId)
                    }
                },
                developer: {
                    connect: {
                        id: parseInt(developerId)
                    }
                },
                mainImagesProject: {
                    create: mainImagesProject.map(i => ({
                        image: i
                    }))
                }
                ,
                projectPaymentPlans: {
                    create: paymentPlans.map(plan => ({
                        value: plan.value,
                        key: plan.key,
                        paymentPlan: {
                            connect: { id: plan.id }
                        }
                    }))
                },
                projectFloorPlans: {
                    create: floorPlans.map(f => ({
                        unitType: f.unitType,
                        startingPrice: f.startingPrice,
                        area: f.area,
                        floorPlan: {
                            connect: { id: f.id }
                        },
                        imagesFloorPlans: {
                            create: f.images.map(i => ({
                                images: i,
                            }))

                        }
                    })),
                }

            },

        })

        if (amenitiesIds && amenitiesIds.length > 0) {
            // remove previous amenities
            await prisma.amenitiesProject.deleteMany({
                where: {
                    projectid: parseInt(id),
                },
            });
            let newAmenities = amenitiesIds.map(item => {
                return {
                    AmenitiesId: parseInt(item),
                    projectid: parseInt(id)
                }
            });
            let multiple = await prisma.amenitiesProject.createMany({
                data: newAmenities,
                // skipDuplicates: true,
            });

        }
        const data = await prisma.project.findUnique({
            where: {
                id: parseInt(id),
            },
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
                projectPaymentPlans: true,
                projectFloorPlans: {
                    include: {
                        floorPlan: true,
                        imagesFloorPlans: true
                    }
                },
                ImagesProject: true,
                amenities: {
                    include: {
                        amenities: true
                    }
                },
                mainImagesProject: true
            }
        })

        return Response.sendResponse(res, {
            msg: '902',
            data,
            lang: req.params.lang
        });

    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });

    }

}

const updateProjectPaymentFloorPlanDraft = async (req, res, next) => {
    const { id } = req.params
    const { mainImagesProject, amenitiesIds, floorPlans, paymentPlans, images, developerId, areaId,
        countryId, cityId,
        ...dataToUpdate
    } = req.body

    console.log(amenitiesIds, floorPlans, paymentPlans, images, developerId, areaId,)

    try {

        // delete all project images 
        const removeImages = await prisma.imagesProject.deleteMany({
            where: { projectId: parseInt(id) }
        })

        // delete all main headers images
        const removePrevMainImage = await prisma.mainImagesProject.deleteMany({
            where: { projectId: parseInt(id) }
        })

        // delete all project floor plans images 
        const removeFloorProjectImages = await prisma.imagesFloorPlans.deleteMany({
            where: {
                projectFloorPlans: {
                    projectId: parseInt(id)
                }
            }
        })

        // delete all project payment plan from pivot table 
        const removePayment = await prisma.projectPaymentPlan.deleteMany({
            where: {
                projectId: parseInt(id)
            }
        })

        // delete all project payment plan from pivot table 
        const removeFloor = await prisma.projectFloorPlan.deleteMany({
            where: {
                projectId: parseInt(id)
            }
        })

        const dataUpdate = await prisma.project.update({
            where: { id: parseInt(id) },
            data: {
                ...dataToUpdate,
                ImagesProject: {
                    create: images.map(i => ({
                        name: i
                    }))
                },
                status:0,
                areaPlace: {
                    connect: {
                        id: parseInt(areaId)
                    }
                },
                country: {
                    connect: {
                        id: parseInt(countryId)
                    }
                },
                city: {
                    connect: {
                        id: parseInt(cityId)
                    }
                },
                developer: {
                    connect: {
                        id: parseInt(developerId)
                    }
                },
                mainImagesProject: {
                    create: mainImagesProject.map(i => ({
                        image: i
                    }))
                }
                ,
                projectPaymentPlans: {
                    create: paymentPlans.map(plan => ({
                        value: plan.value,
                        key: plan.key,
                        paymentPlan: {
                            connect: { id: plan.id }
                        }
                    }))
                },
                projectFloorPlans: {
                    create: floorPlans.map(f => ({
                        unitType: f.unitType,
                        startingPrice: f.startingPrice,
                        area: f.area,
                        floorPlan: {
                            connect: { id: f.id }
                        },
                        imagesFloorPlans: {
                            create: f.images.map(i => ({
                                images: i,
                            }))

                        }
                    })),
                }

            },

        })

        if (amenitiesIds && amenitiesIds.length > 0) {
            // remove previous amenities
            await prisma.amenitiesProject.deleteMany({
                where: {
                    projectid: parseInt(id),
                },
            });
            let newAmenities = amenitiesIds.map(item => {
                return {
                    AmenitiesId: parseInt(item),
                    projectid: parseInt(id)
                }
            });
            let multiple = await prisma.amenitiesProject.createMany({
                data: newAmenities,
                // skipDuplicates: true,
            });

        }
        const data = await prisma.project.findUnique({
            where: {
                id: parseInt(id),
            },
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
                projectPaymentPlans: true,
                projectFloorPlans: {
                    include: {
                        floorPlan: true,
                        imagesFloorPlans: true
                    }
                },
                ImagesProject: true,
                amenities: {
                    include: {
                        amenities: true
                    }
                },
                mainImagesProject: true
            }
        })

        return Response.sendResponse(res, {
            msg: '902',
            data,
            lang: req.params.lang
        });

    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });

    }

}

const publishProjectPaymentFloorPlanDraft = async (req, res, next) => {
    const { id } = req.params

    try {
        const dataUpdate = await prisma.project.update({
            where: { id: parseInt(id) },
            data: {
                status:1
            }
        })

        const data = await prisma.project.findUnique({
            where: {
                id: parseInt(id),
            },
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
                projectPaymentPlans: true,
                projectFloorPlans: {
                    include: {
                        floorPlan: true,
                        imagesFloorPlans: true
                    }
                },
                ImagesProject: true,
                amenities: {
                    include: {
                        amenities: true
                    }
                },
                mainImagesProject: true
            }
        })

        return Response.sendResponse(res, {
            msg: '910',
            data,
            lang: req.params.lang
        });

    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });

    }

}

const deleteProjectPaymentFloorPlan = async (req, res, next) => {
    const { id } = req.params

    try {
        const ExistProject = await prisma.project.findFirst({
            where: {
                status: 1, id: parseInt(id),
            }
        })
        if (ExistProject == null) {
            return next({ msg: 905 });
        }

        const data = await prisma.project.update({
            where: { id: parseInt(id) },
            data: {
                status: 0
            }

        })

        return Response.sendResponse(res, {
            msg: '904',
            data,
            lang: req.params.lang
        });
    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });

    }
}

const reactiveProjectPaymentFloorPlan = async (req, res, next) => {
    const { id } = req.params

    try {
        const ExistProject = await prisma.project.findFirst({
            where: {
                status: 0, id: parseInt(id),

            }
        })
        if (ExistProject == null) {
            return next({ msg: 905 });
        }

        const data = await prisma.project.update({
            where: { id: parseInt(id) },
            data: {
                status: 1
            }

        })

        return Response.sendResponse(res, {
            msg: '906',
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

const getAllFloorPlans = async (req, res, next) => {
    return Response.sendResponse(res, {
        msg: '906',
        data: {
            data: {
                floorPlans: global.config.projectFloorPlans
            }
        },
        lang: req.params.lang
    });
}

const isFeature = async (req, res, next) => {
    const { id } = req.params
    const { isFeature } = req.body

    try {
        const existPro = await prisma.project.findFirst({
            where: {
                id: parseInt(id),
                status: 1
            }
        })

        if (existPro) {
            const data = await prisma.project.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    isFeature
                }
            })

            return Response.sendResponse(
                res, {
                msg: '907',
                data: {
                    data: data,
                },
                lang: req.params.lang
            });
        } else {
            return Response.sendResponse(
                res, {
                msg: '908',
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

const sendProjectEmail = async (req, res, next) => {
    try {
        const selector = {
            where: {
                id: parseInt(req.params.id),
                status: 1,
            },
            include: {
                ImagesProject: true,
                teamMember: true,
                mainImagesProject: true
            }
        };
        const foundProject = await prisma.project.findFirst(selector);

        if (!foundProject) {
            return next({ msg: 503 })
        }
        // ejs.renderFile(
        //     path.join(process.cwd(), "/templates/emails/propertyDetails.ejs"),
        //     {
        //       serverurl: config.backendAssetsUrl,
        //       property: foundProject,
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
        sendEmail(null, null, [req.body.email, foundProject.teamMember.email], "projectDetails",
            {
                backendAssetsUrl: config.backendAssetsUrl,
                project: foundProject,
                customer: req.body
            },
            "Homes and Byond Request form for " + foundProject.title
        )
        return Response.sendResponse(
            res, {
            msg: '515',
            data: {
                foundProject: foundProject,
            },
            lang: req.params.lang
        });


    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });
    }
}


const searchProject = async (req, res, next) => {
    try {
    const {
        type,
        search,
        fromArea,
        toArea,
        cityId,
        area,
        countryId,
        completionStatus
    } = req.query;
    const { count, page, sort } = req.params

    // const minPriceFloat = parseFloat(minPrice);
    // const maxPriceFloat = parseFloat(maxPrice);


    const searchQuery = {
        AND: [
           
        ]
    };

    // if (cityId && cityId != 0) {
    //     searchQuery.AND.push({
    //         cityId: parseInt(cityId)
    //     })
    // }

    if(search && search != ""){
        searchQuery.AND.push({
            title: {contains: search}
        })
    }

    if (area && area?.length > 0) {
        searchQuery.AND.push({
            areaId: {in:area?.map((item) => parseInt(item))}
        })
    }

    // if (countryId && countryId != 0) {
    //     searchQuery.AND.push({
    //         countryId: parseInt(countryId)
    //     })
    // }

    // if (fromArea && toArea) {
    //     searchQuery.AND.push({
    //         area: {
    //             gte: parseFloat(fromArea),
    //             lte: parseFloat(toArea),
    //         },
    //     });
    // }

    // if (minPriceFloat && maxPriceFloat) {
    //     searchQuery.AND.push({
    //         price: { gte: minPriceFloat, lte: maxPriceFloat },
    //     })
    // }

    if (type && type?.length > 0) {
        searchQuery.AND.push({
            type: {in:type},
        });
    }

    // if(completionStatus && completionStatus != "All"){
    //     console.log(global.config.quartersIsCompleted?.[new Date().getMonth()]);
    //     const currDate = new Date();

    //     if(completionStatus?.toLowerCase() == "ready"){
    //         searchQuery.AND.push({
    //            OR:[
    //             { handOverYear: null},
    //             {handOverYear: {lt: currDate.getFullYear()}},
    //             {
    //                 AND:[
    //                     {handOverYear: currDate.getFullYear()},
    //                     {handOverYearQuarter: {in: global.config.quartersIsCompleted?.[currDate.getMonth()] ?? []}}
    //                 ]
    //             }
    //            ]
    //         })
           
    //     }
    //     else if(completionStatus?.toLowerCase() == "off-plan"){
    //         searchQuery.AND.push({
    //            OR:[
    //             {handOverYear:{gt: currDate.getFullYear()}},
    //             {
    //                 AND:[
    //                     {handOverYear: currDate.getFullYear()},
    //                     {handOverYearQuarter:{notIn:global.config.quartersIsCompleted?.[currDate.getMonth()] ?? []}}
    //                 ]
    //             }
    //            ]
    //         })
    //     }
        
    // }

    

    let sortObj = {}
    //propertyPrice
    switch(sort){
        case "desc": sortObj = {createdAt:"desc"}
        break
        case "asc": sortObj = {createdAt:"asc"}
        break;
        case "priceDesc": sortObj = {price:"desc"}
        break;
        case "priceAsc":sortObj = {price:"asc"}
        break
        default: sortObj = {createdAt:"desc"}
    }

    
        const properties = await prisma.project.findMany({
            take: parseInt(count),
            skip: (parseInt(page) - 1) * parseInt(count),
            where: {
                ...searchQuery,
                
                status: 1,
            },
            // orderBy: {
            //     createdAt: sort
            // },
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
                projectPaymentPlans: {
                    include: {
                        paymentPlan: true
                    }
                },
                projectFloorPlans: {
                    include: {
                        floorPlan: true,
                        imagesFloorPlans: true,
                    }
                },
                ImagesProject: true,
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
                amenities: {
                    include: {
                        amenities: true
                    }
                },
                mainImagesProject: true
            },
            orderBy: sortObj

        });
        // all field has same filtering
       const projectCount = await prisma.project.findMany({

            where: {
                ...searchQuery,
                status: 1,
            },
            include: {
                projectPaymentPlans: {
                    include: {
                        paymentPlan: true
                    }
                },
                projectFloorPlans: {
                    include: {
                        floorPlan: true,
                        imagesFloorPlans: true,
                    }
                },
                ImagesProject: true,
                teamMember: true,
                amenities: {
                    include: {
                        amenities: true
                    }
                }
            }
        });



        let totalPages = (parseInt(projectCount.length) / parseInt(count))

        totalPages = Number.isInteger(totalPages) ? totalPages : parseInt(totalPages) + 1
        return Response.sendResponse(
            res, {
            msg: '509',
            data: {
                projects: properties,
                page: page,
                count: projectCount.length,
                totalPages: totalPages
            },
            lang: req.params.lang
        });

    } catch (err) {
        console.log(err);
        return next({ msg: 3067 })
    }
}

const getAllProjectsByIds = async(req,res,next) => {
    try{
        const {id} = req.query
        let arrIds = id && id?.length > 0 ? id : []
        
            const projects = await prisma.project.findMany({
                where:{
                    id:{in:arrIds?.map((id) => parseInt(id))}
                },
                include:{
                    areaPlace:true,
                    teamMember:true,
                    mainImagesProject:true
                }
            });

            console.log(arrIds,projects);

            return Response.sendResponse(
                res, {
                msg: '509',
                data: {
                    projects: projects,
                },
                lang: req.params.lang
            });

        
    }catch(err){
        console.log(err);
        return next({ msg: 3067 })
    }
}

module.exports = {
    getAllProjectPaymentFloorPlan,
    getOneProjectPaymentFloorPlan,
    createProjectPaymentFloorPlan,
    updateProjectPaymentFloorPlan,
    deleteProjectPaymentFloorPlan,
    reactiveProjectPaymentFloorPlan,
    getAllFloorPlans,
    isFeature,
    getAllProjectPaymentFloorPlanByAgent,
    sendProjectEmail,
    searchProject,
    getOneProjectPaymentFloorPlanById,
    getOneProjectPaymentFloorPlanByIdDraft,
    updateProjectPaymentFloorPlanDraft,
    publishProjectPaymentFloorPlanDraft,
    getAllProjectPaymentFloorPlanByAgentDraft,
    getAllProjectPaymentFloorPlanByArea,
    getAllProjectsByIds
};
