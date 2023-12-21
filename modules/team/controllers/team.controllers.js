
const Response = require('../../../configuration/config.response'),
    bcrypt = require('bcrypt'),
    { PrismaClient } = require('@prisma/client'),
    Prisma = new PrismaClient(),
    jwt = require("jsonwebtoken");

//Create Team
const createTeam = async (req, res, next) => {
    try {
        if (!req.body.email || !req.body.password) {
            return next({ msg: 100 });
        }
        const saltRounds = 10,
            plainPassword = req.body.password;

        const validate_email = await Prisma.Team.findFirst({
            where: {
                email: req.body.email,
                status: 1
            }
        })
        if (validate_email) {
            return next({ msg: 104 });
        }

        const password = await bcrypt.hash(plainPassword, saltRounds);
        const team = {
            firstName: req.body.firstName || undefined,
            lastName: req.body.lastName || undefined,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber || undefined,
            cellNumber: req.body.cellNumber || undefined,
            gender: req.body.gender || undefined,
            description: req.body.description || undefined,
            address: req.body.address || undefined,
            avatar: req.body.avatar || undefined,
            zipCode: req.body.zipCode || undefined,
            facebookUrl: req.body.facebookUrl || undefined,
            twitterUrl: req.body.twitterUrl || undefined,
            googleUrl: req.body.googleUrl || undefined,
            dateOfBirth: new Date(req.body.dateOfBirth) || undefined,
            websiteUrl: req.body.websiteUrl || undefined,
            linkedInUrl: req.body.linkedInUrl || undefined,
            password: password,
            status: 1,
            area: {
                create: req.body?.areaIds?.map(id => ({
                    area: {
                        connect: {
                            id: parseInt(id),
                        },
                    }
                }))
            },
        };
        const check_email = await Prisma.Team.findFirst({
            where: {
                email: req.body.email,
            }
        })
        let created_team;
        if (validate_email) {
            created_team = await Prisma.Team.update({
                where: {
                    id: check_email.id
                },
                data: team,

            });
        } else {
            created_team = await Prisma.Team.create({
                data: team,
                include: {
                    area: {
                        include: {
                            area: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    }
                }
            });
        }
        delete created_team.password;
        const jwtToken = jwt.sign(
            { id: created_team.id, user: created_team },
            config.jwtSetting.secret
        );
        return Response.sendResponse(
            res, {
            msg: '400',
            data: {
                jwtToken,
                team: created_team,
            },
            lang: req.params.lang
        });

    } catch (err) {
        console.log(err);
        return next({ msg: 3067 })
    }
}


const teamMemberWithToken = async (req, res, next) => {
    try {
        const { logintoken } = req.headers;


        const user = await Prisma.Team.findFirst({
            where: {
                token: logintoken
            }
        })

        if (!user) {
            return next({ msg: 103, code: 404 });
        }

        return Response.sendResponse(
            res, {
            msg: '300',
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
const findOneTeam = async (req, res, next) => {
    
    try {
        
        const data = await Prisma.Team.findFirst({
            where: {
                id: parseInt(req.params.id),
                status: 1
            },
            include: {
                properties:{
                    take:9,
                    orderBy:{
                        propertyPrice:"desc"
                    },
                       include:{
                        images:true,
                        specification:{
                            include:{
                                specification:true
                            }
                        },
                        areaPlace:true,
                        developer: true
                       }
                },

                project:{
                    take:9,
                    orderBy:{
                        price:"desc"
                    },
                    include:{
                        mainImagesProject:true,
                        areaPlace:true
                    }
                },
                area: {
                    take:7,
                   
                    include: {
                        area: {
                            
                            select: {
                                id: true,
                                name: true,
                                property:true,
                                mainImage:true
                            }
                        }
                    }
                }

            }
        });
        if(!data){
          return  res.json("Agent not Found")
        }
        // console.log(foundTeam)
        return Response.sendResponse(
            res,
            {
                msg: '403',
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

const myProfile = async (req, res, next) => {
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

//Find All Teams
const findAllTeam = async (req, res, next) => {
    try {
        let get_all_team = await Prisma.team.findMany({
            take: parseInt(req.params.count),
            skip: (parseInt(req.params.page) - 1) * parseInt(req.params.count),
            where: {
                status: 1,
            },
            include: {
                properties: {
                    where: {
                        status: 1
                    }
                },
                area: {
                    include: {
                        area: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                languages:true
                
            },
            orderBy: {
                createdAt: req.params.sort
            }
        });
        // console.log(get_all_team)
        let all_team = get_all_team.map((team) => {
            return {
                ...team,
                CountProperties: team.properties.length
            }
        })
        const team_count = await Prisma.Team.findMany({
            where: {
                status: 1
            }
        });
        let totalPages = parseInt(team_count.length) / parseInt(req.params.count);

        totalPages = Math.ceil(totalPages);
        return Response.sendResponse(
            res, {
            msg: '404',
            data: {
                team: get_all_team,
                page: req.params.page,
                count: parseInt(team_count.length),
                totalPages: totalPages
            },
            lang: req.params.lang
        });

    } catch (err) {
        return next({ msg: 3067 })
    }
}
//Update Team
const updateTeam = async (req, res, next) => {
    try {
        const team = {
            firstName: req.body.firstName || undefined,
            lastName: req.body.lastName || undefined,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber || undefined,
            cellNumber: req.body.cellNumber || undefined,
            gender: req.body.gender || undefined,
            description: req.body.description || undefined,
            address: req.body.address || undefined,
            avatar: req.body.avatar || undefined,
            zipCode: req.body.zipCode || undefined,
            facebookUrl: req.body.facebookUrl,
            twitterUrl: req.body.twitterUrl,
            googleUrl: req.body.googleUrl,
            dateOfBirth: new Date(req.body.dateOfBirth) || undefined,
            websiteUrl: req.body.websiteUrl,
            linkedInUrl: req.body.linkedInUrl,
            area: {
                create: req.body?.areaIds?.map(id => ({
                    area: {
                        connect: {
                            id: parseInt(id),
                        },
                    }
                }))
            },
        };
        console.log('====================', parseInt(req.params.id))
        if (req.body.password) {
            const saltRounds = 10,
                plainPassword = req.body.password;

            const password = await bcrypt.hash(plainPassword, saltRounds);
            team.password = password;
        }
        const where = {
            id: parseInt(req.params.id),

        };
        // remove previous Images Area
        const removeAreaAgent = await Prisma.agentArea.deleteMany({
            where: {
                agentId: parseInt(req.params.id)
            },
        })

        let updated_team = await Prisma.Team.update({ where, data: team });
        updated_team.password = req.body.password;
        return Response.sendResponse(
            res, {
            msg: '401',
            data: {
                team: updated_team,
            },
            lang: req.params.lang
        });

    } catch (err) {
        console.log(err);
        return next({ msg: 3067 })
    }
}


//delete Team
const deleteTeam = async (req, res, next) => {
    try {
        const teamMemberProperty = await Prisma.property.findFirst({
            where: {
                teamMemberId: parseInt(req.params.id),
                status: 1
            }
        })
        if (teamMemberProperty) {
            return next({ msg: 105 })
        }
        const selector = {
            where: {
                id: parseInt(req.params.id),
            },
            data: {
                status: 0
            }
        };
        const deleted_team = await Prisma.Team.update(selector);
        return Response.sendResponse(
            res, {
            msg: '402',
            data: {
                team: req.params.id,
            },
            lang: req.params.lang
        });
    } catch (err) {
        console.log(err);
        return next({ msg: 3067 })
    }
}

const loginController = async (req, res, next) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next({ msg: 100 });
        }
        const userWithEmail = await Prisma.Team.findFirst({
            where: {
                email: email,
                status: 1
            }
        });
        console.log(userWithEmail)

        if (!userWithEmail) {
            return next({ msg: 102 });
        }


        let isPasswordMatched = await bcrypt.compare(password, userWithEmail.password);

        if (!isPasswordMatched) {
            return next({ msg: 102 });
        }
        const jwtToken = jwt.sign(
            { id: userWithEmail.id, user: userWithEmail },
            config.jwtSetting.secret
        );

        delete userWithEmail.password;

        return Response.sendResponse(
            res, {
            msg: '405',
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

const getFiveRandomAgents = async (req, res, next) => {

    try {
        const data = await Prisma.$queryRaw`SELECT * FROM Team WHERE status = 1  ORDER BY RAND()  LIMIT 6`
        return Response.sendResponse(
            res, {
            msg: '405',
            data: {
                data
            },
            lang: req.params.lang
        });
    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });

    }
}

const getNameIdAgent = async (req, res, next) => {
    try {
        const data = await Prisma.Team.findMany({
            where:{
                status: 1
            },
            orderBy: {
                firstName: 'asc'
            },
            select: {
                id: true,
                firstName: true,
                lastName: true
            }
        })
        if (data) {
            return Response.sendResponse(
                res, {
                msg: '404',
                data: {
                    team: data,
                },
                lang: req.params.lang
            });
        }
    } catch (err) {
        return next({ msg: 3067 })
    }
}
module.exports = {
    createTeam,
    teamMemberWithToken,
    myProfile,
    findOneTeam,
    findAllTeam,
    updateTeam,
    deleteTeam,
    loginController,
    getFiveRandomAgents,
    getNameIdAgent
};
