const { config } = require('dotenv');

const Response = require('../../../configuration/config.response'),
    { PrismaClient } = require('@prisma/client'),
    { sendEmail } = require("../../../configuration/config.mailer"),
    ejs = require("ejs"),
    Prisma = new PrismaClient();


const searchValues = async (req, res, next) => {


    const { search} = req.query;
    // const { count, page, sort } = req.params

    const searchQueryProperties = {
        AND: [
        ]
    };

    const searchQueryOffplan = {
        AND: [
        ]
    };

    const searchQueryArea = {
        AND: [
        ]
    };

    const searchQueryTeam = {
        AND: [
        ]
    };
    
    

    if(search && search?.length > 0){
        searchQueryProperties.AND.push({
            
                OR: [
                    { title: { contains:search} },
                    { description: { in: search } },
                    { address: { contains: search}  },
                    { city: { name:{contains: search } }},
                    {areaPlace:{name:{contains:search}}}
                ]
            
        })
        searchQueryOffplan.AND.push({
            
            OR: [
                { title: { contains:search} },
                { description: { in: search } },
                {areaPlace:{name:{contains:search}}},
                { city: { name:{contains: search } }},
                { address: { contains: search}  },
                
            ]
        
    })
    searchQueryArea.AND.push({
            
        OR: [
            { name: { contains:search} },
            { about: { contains: search } },
            { city: { name:{contains: search } }},
            
        ]
    
})

    searchQueryTeam.AND.push({
                    
            OR: [
                { firstName: { contains:search} },
                { lastName: { contains: search } },
   
            ]

        })
    }



    try {
        const buyProperties = await Prisma.Property.findMany({
            where: {
                ...searchQueryProperties,
                status: 1,
                isbuy: true,    
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
                specification: {
                    include: {
                        specification: true
                    }
                },
                nearBy: true,
                images: true,
            },
            orderBy: {createdAt:"desc"}
        });

        const rentProperties = await Prisma.Property.findMany({
            where: {
                ...searchQueryProperties,
                status: 1,
                isrent: true,    
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
                specification: {
                    include: {
                        specification: true
                    }
                },
                nearBy: true,
                images: true,
            },
            orderBy: {createdAt:"desc"}
        });
      
        const projects = await Prisma.Project.findMany({
            where: {
                ...searchQueryOffplan,
                status: 1,
                
                
            },
            orderBy: {createdAt:"desc"}
        });

        const areas = await Prisma.Area.findMany({
            where: {
                ...searchQueryArea,
                
                
            },
            orderBy: {createdAt:"desc"}
        });

        const agents = await Prisma.Team.findMany({
            where: {
                ...searchQueryTeam,
                status: 1,
                
                
            },
            orderBy: {createdAt:"desc"}
        });
        
        return Response.sendResponse(
            res, {
            msg: '517',
            data: {
                buy: buyProperties,
                rent: rentProperties,
                offPlan: projects,
                areas: areas,
                agents: agents
                
            },
            lang: req.params.lang
        });

    } catch (err) {
        console.log("error",err);
        return next({ msg: 3067 })
    }
}



module.exports = {
    searchValues,

};
