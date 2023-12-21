const { config } = require('dotenv');

const Response = require('../../../configuration/config.response'),
    { PrismaClient } = require('@prisma/client'),
    Prisma = new PrismaClient();


//find all view
//find all buildings
//find all paymentstype
const createProject = async (req, res, next) => {
    try {

        const { title, description, price, developer, lifestyle, completionDate, titleType } = req.body;
        let { amenetiesIds, NearBySchools, NearByPlaces, paymentIds, views, buildings, images } = req.body;

        if (!title || !description || !price || !developer || !lifestyle || !completionDate || !titleType) {
            return next({ msg: 500 });
        }
        console.log(req.user.id)
        const project = {
            title: req.body.title,
            description: req.body.description,
            descImage: req.body.descImage,
            titleImage: req.body.titleImage,
            brochureUrl: req.body.brochureUrl,
            floorPlansBrochureUrl: req.body.floorPlansBrochureUrl,
            videoThumbnailUrl: req.body.videoThumbnailUrl,
            videoUrl: req.body.videoUrl,
            totalAmountOfUnits: req.body.totalAmountOfUnits,
            price: req.body.price,
            phone: req.body.phone,
            developer: req.body.developer,
            lifestyle: req.body.lifestyle,
            completionDate: new Date(req.body.completionDate),
            titleType: req.body.titleType,
            attachment: req.body.attachment,
            country: req.body.country,
            city: req.body.city,
            teamMemberId: req.user.id
            // teamMemberId: req.body.teamMemberId
        };

        if (req.body.lat && req.body.lon) {
            project.lat = req.body.lat
            project.lon = req.body.lon
        }
        if (req.body.address) {
            project.address = req.body.address
        }
        if (req.body.facebook && req.body.linkedin && req.body.twitter) {
            project.facebook = req.body.facebook
            project.linkedin = req.body.linkedin
            project.twitter = req.body.twitter
        }

        if (amenetiesIds && amenetiesIds.length > 0) {
            amenetiesIds = amenetiesIds.map((item) => {
                return {
                    AmenitiesId: item,
                }
            });
            project.amenities = {
                create: amenetiesIds
            }
        }

        if (NearBySchools && NearBySchools.length > 0) {
            for (let i = 0; i < NearBySchools.length; i++) {
                if (!NearBySchools[i].name) {
                    return next({ msg: 501 });
                }
            }
            NearBySchools = NearBySchools.map(item => {
                console.log("item name", item.name);
                console.log("item desc", item.description);

                return {
                    name: item.name,
                    description: item.description || null,
                    ratings: item.ratings || 0
                }
            });
            project.NearBySchools = {
                create: NearBySchools
            }
        }

        if (NearByPlaces && NearByPlaces.length > 0) {
            for (let i = 0; i < NearByPlaces.length; i++) {
                if (!NearByPlaces[i].name) {
                    return next({ msg: 501 });
                }
            }
            NearByPlaces = NearByPlaces.map(item => {
                return {
                    name: item.name,
                }
            });
            project.NearByPlaces = {
                create: NearByPlaces
            }
        }

        if (paymentIds && paymentIds.length > 0) {
            paymentIds = paymentIds.map((item) => {
                return {
                    paymentIds: item,
                }
            });
            project.payments = {
                create: paymentIds
            }
        }

        if (views && views.length > 0) {
            for (let i = 0; i < views.length; i++) {
                if (!views[i].name) {
                    return next({ msg: 501 });
                }
            }
            views = views.map(item => {
                return {
                    name: item.name,
                }
            });
            project.views = {
                create: views
            }
        }

        if (buildings && buildings.length > 0) {
            for (let i = 0; i < buildings.length; i++) {
                if (!buildings[i].name) {
                    return next({ msg: 501 });
                }
            }
            buildings = buildings.map(item => {
                return {
                    name: item.name,
                }
            });
            project.buildings = {
                create: buildings
            }
        }


        if (images && images.length > 0) {
            images = images.map(item => {
                return {
                    link: item
                }
            });
            project.images = {
                create: images
            }
        }

        console.log(project);
        const created_project = await Prisma.Project.create({ data: project });

        return Response.sendResponse(
            res, {
            msg: '600',
            data: {
                project: created_project,
            },
            lang: req.params.lang
        });
    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });

    }
}

const findAllProject = async (req, res, next) => {
    try {
        const count = req.query.count || 10;
        const page = req.query.page || 1;
        // const sortFilter = req.query.sort || "desc";

        const all_projects = await Prisma.Project.findMany({
            where: {
                status: 1,
            },
            include: {
                properties: true,
                NearByPlaces: true,
                NearBySchools: true,
                amenities: true,
                payments: true,
                images: true,
                views: true,
            },
            take: parseInt(count),
            skip: (parseInt(page) - 1) * parseInt(count),
            orderBy: {
                createdAt: "desc"
            }
        });
        // if(!all_projects.length > 0 ) {
        //     return next({ msg:  653}) // no projects found
        // }
        return Response.sendResponse(
            res, {
            msg: '604',
            data: {
                project: all_projects,
            },
            lang: req.params.lang
        });
    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });

    }
}

const findOneProject = async (req, res, next) => {

    const selector = {
        where: {
            id: parseInt(req.params.id),
            status: 1 //mean if he is active/unDisable
        },
        include: {
            properties: {
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
                }
            },
            NearByPlaces: true,
            NearBySchools: true,
            amenities: true,
            payments: true,
            images: true,
            views: true,
        },
    };

    const foundProject = await Prisma.Project.findFirst(selector);

    if (!foundProject) {
        return next({ msg: 503 })
    }
    try {
        return Response.sendResponse(
            res,
            {
                msg: '603',
                data: {
                    project: foundProject,
                },
                lang: req.params.lang
            });
    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });

    }
}

const updateProject = async (req, res, next) => {
    try {

        const where = {
            id: parseInt(req.params.id),
        };

        const exist = await Prisma.Project.findUnique({
            where
        })

        if (!exist) {
            return next({ msg: 654 })
        }

        let { amenetiesIds, specificationIds, NearByPlaces, NearBySchools, images, buildings, views, paymentIds } = req.body;

        const date = new Date(req.body.completionDate);
        completionDate = isNaN(date) ? undefined : date;


        const project = {
            title: req.body.title || undefined,
            description: req.body.description || undefined,
            descImage: req.body.descImage || undefined,
            titleImage: req.body.titleImage || undefined,

            brochureUrl: req.body.brochureUrl || undefined,
            floorPlansBrochureUrl: req.body.floorPlansBrochureUrl || undefined,


            videoThumbnailUrl: req.body.videoThumbnailUrl || undefined,
            videoUrl: req.body.videoUrl || undefined,
            totalAmountOfUnits: req.body.totalAmountOfUnits || undefined,

            completionDate: completionDate || undefined,
            price: req.body.price || undefined,
            phone: req.body.phone || undefined,

            developer: req.body.developer || undefined,
            lifestyle: req.body.lifestyle || undefined,
            // completionDate: new Date(req.body.completionDate) || undefined,
            titleType: req.body.titleType || undefined,
            attachment: req.body.attachment || undefined,

            lat: req.body.lat || undefined,
            lon: req.body.lon || undefined,

            address: req.body.address || undefined,
            phone: req.body.phone || undefined,

            facebook: req.body.facebook || undefined,
            linkedin: req.body.linkedin || undefined,
            twitter: req.body.twitter || undefined,

            // city: req.body.city || undefined,
            // country: req.body.country || undefined

        };

        const updated_project = await Prisma.Project.update({ where, data: project });

        if (amenetiesIds && amenetiesIds.length > 0) {
            await Prisma.AmenitiesProject.deleteMany({
                where: {
                    projectid: parseInt(req.params.id),
                },
            });
            let newAmeneties = amenetiesIds.map(item => {
                console.log('aminities', item);
                return {
                    AmenitiesId: parseInt(item),
                    projectid: parseInt(req.params.id)
                }
            });
            console.log("newAmeneties", newAmeneties);
            await Prisma.AmenitiesProject.createMany({
                data: newAmeneties,
                // skipDuplicates: true,
            });
        }

        if (paymentIds && paymentIds.length > 0) {
            await Prisma.ProjectPaymentTypes.deleteMany({
                where: {
                    projectId: parseInt(req.params.id),
                },
            });
            let newPaymentTypes = paymentIds.map(item => {
                console.log('newPaymentTypes', item);
                return {
                    paymentIds: parseInt(item),
                    projectId: parseInt(req.params.id)
                }
            });
            console.log("newPaymentTypes", newPaymentTypes);

            await Prisma.ProjectPaymentTypes.createMany({
                data: newPaymentTypes,
                // skipDuplicates: true,
            });
        }

        if (buildings && buildings.length > 0) {
            await Prisma.ProjectBuilding.deleteMany({
                where: {
                    projectId: parseInt(req.params.id),
                },
            });
            let newBuildings = buildings.map(item => {
                console.log('buildings', item);
                return {
                    name: item.name,
                    projectId: parseInt(req.params.id)
                }
            });
            console.log("newBuildings", newBuildings);
            await Prisma.ProjectBuilding.createMany({
                data: newBuildings,
            });
        }

        if (views && views.length > 0) {
            await Prisma.projectView.deleteMany({
                where: {
                    projectId: parseInt(req.params.id)
                }
            })

            let newViews = views.map(item => {
                return {
                    name: item.name,
                    projectId: parseInt(req.params.id)
                }
            })

            await Prisma.projectView.createMany({
                data: newViews,
            })
        }

        if (NearByPlaces && NearByPlaces.length > 0) {
            await Prisma.NearByPlace.deleteMany({
                where: {
                    projectId: parseInt(req.params.id),
                }
            })
            NearByPlaces = NearByPlaces.map(item => {
                return {
                    name: item.name || undefined,
                    projectId: parseInt(req.params.id)
                }
            })
            console.log("new NearByPlaces", NearByPlaces);

            let multiple = await Prisma.NearByPlace.createMany({
                data: NearByPlaces,
                // skipDuplicates: true,
            });
        }

        if (NearBySchools && NearBySchools.length > 0) {
            await Prisma.NearBySchools.deleteMany({
                where: {
                    projectId: parseInt(req.params.id),
                }
            })
            NearBySchools = NearBySchools.map(item => {
                return {
                    name: item.name || undefined,
                    description: item.description || undefined,
                    ratings: parseFloat(item.ratings) || undefined,
                    projectId: parseInt(req.params.id)
                }
            })
            console.log("new NearBySchools", NearBySchools);

            let multiple = await Prisma.NearBySchools.createMany({
                data: NearBySchools,
                // skipDuplicates: true,
            });
        }

        if (images && images.length > 0) {
            await Prisma.ProjectImages.deleteMany({
                where: {
                    projectid: parseInt(req.params.id),
                },
            });
            images = images.map(item => {
                return {
                    link: item,
                    projectid: parseInt(req.params.id)
                }
            });
            let multiple = await Prisma.ProjectImages.createMany({
                data: images,
                // skipDuplicates: true,
            });
        }

        return Response.sendResponse(
            res, {
            msg: '601',
            data: {
                project: updated_project,
            },
            lang: req.params.lang
        });

    } catch (err) {
        console.log(err);
        return next({ msg: 3067 })
    }
}

const deleteProject = async (req, res, next) => {
    try {

        const exist = await Prisma.Project.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        })

        if (!exist) {
            return next({ msg: 654 })
        }

        await Prisma.Project.update({
            where: {
                id: exist?.id
            },
            data: {
                status: 0
            }
        })

        return Response.sendResponse(
            res, {
            msg: '602',
            lang: req.params.lang
        });


    } catch (err) {
        console.log(err);
        return next({ msg: 3067 })
    }
}

const getViews = async (req, res, next) => {
    try {

        const exist = await Prisma.Project.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        })

        if (!exist) {
            return next({ msg: 654 })
        }

        const views = await Prisma.ProjectView.findMany({
            where: {
                projectId: exist?.id
            }
        })

        return Response.sendResponse(
            res,
            {
                msg: '605',
                data: { views },
                lang: req.params.lang
            });

    } catch (err) {
        console.log(err);
        return next({ msg: 3067 })
    }
}

const getBuildings = async (req, res, next) => {
    try {
        const exist = await Prisma.Project.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        })

        if (!exist) {
            return next({ msg: 654 })
        }

        const buildings = await Prisma.ProjectBuilding.findMany({
            where: {
                projectId: exist?.id
            }
        })

        return Response.sendResponse(res, {
            msg: '606',
            data: { buildings },
            lang: req.params.lang
        })
    } catch (err) {
        console.log(err);
        return next({ msg: 3067 })
    }
}

const getPaymentTypes = async (req, res, next) => {
    try {

        const Payments = await Prisma.Payments.findMany({
            // select: {
            //     projectId : true,
            //     payments: {
            //         select: {
            //             id: true,
            //             key: true,
            //             status: true
            //         }
            //     }
            // }
        })

        return Response.sendResponse(res, {
            msg: '607',
            data: { Payments },
            lang: req.params.lang
        })
    } catch (err) {
        console.log(err);
        return next({ msg: 3067 })
    }
}

const preload = async (req, res, next) => {
    try {
        return Response.sendResponse(
            res, {
            msg: '510',
            data: {
                propertyTypes: global.config.propertyTypes,
                projectTypes: global.config.projectTypes,
                projectStatus: global.config.projectStatus,
                projectFloorPlans: global.config.projectFloorPlans,
                unitTypes: global.config.unitTypes,
                paymentPlans: global.config.paymentPlans,
            },
            lang: req.params.lang
        });
    } catch (err) {
        console.log(err);
        return next({ msg: 3067 })
    }
}
module.exports = {
    createProject,
    findAllProject,
    findOneProject,
    updateProject,
    deleteProject,
    getViews,
    getBuildings,
    getPaymentTypes,
    preload
};