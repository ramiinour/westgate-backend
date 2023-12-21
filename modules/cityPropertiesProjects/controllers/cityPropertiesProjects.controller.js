const { PrismaClient } = require("@prisma/client")
const Response = require("../../../configuration/config.response");
const { orderBy } = require("lodash");

const prisma = new PrismaClient()


const howManyPropertiesAndProjectsInCity = async (req, res, next) => {
    try {

        const propertyCounts = await prisma.property.groupBy({
            by: ['city'],
            _count: {
                city: true
            },
            orderBy: {
                _count: {
                    city: 'desc'
                }
            }
        });

        const projectsCounts = await prisma.project.groupBy({
            by: ['city'],
            _count: {
                city: true,
            },
            orderBy: {
                _count: {
                    city: 'desc'
                }
            }
        });
        
        return Response.sendResponse(res, {
            msg: '800',
            data: {
                data: {
                    propertyCounts,
                    projectsCounts
                }
            },
            lang: req.params.lang
        });

        /*
        * extracting the data to be like this 
        * {
        *   city: "dubai",
        *   propertiesCount: 14,
        *   projectsCount: 15
        * }
        */

        // const dataCommon = projectsCounts.map(e => {
        //     let propCount = {}

        //     for (let i = 0; i < propertyCounts.length; i++) {
        //         if (propertyCounts[i].city === e.city) {

        //             propCount = propertyCounts[i]._count.city
        //             // console.log("iiiiiiiiiiiiii", propCount)
        //             break;
        //         }
        //     }
        //     // console.log("iiiiiiiiiiiiiiiiiiiiiiii", propCount)
        //     return {
        //         city: e.city,
        //         propertyCount: propCount,
        //         projectsCount: e._count.city
        //     }
        // })

        // const dataPropDiff = projectsCounts.map(e => {
        //     let dataPropCount = {}
        //     for (let i = 0; i < dataCommon.length; i++) {
        //         if (dataCommon[i].city != e.city) {
        //             dataPropCount = {
        //                 ...dataPropCount,
        //                 propertyCount: dataCommon[i]._count.city,
        //                 projectsCount: 0
        //             }
        //         }
        //     }
        //     return dataPropCount
        // })
        // const data = {
        //     ...dataCommon,
        //     ...dataPropDiff
        // }
        // console.log('iiiiiiiiiiiiiiii', data)
        // const anything = {
        //     ...projectsCounts,
        //     ...propertyCounts
        // }
        // console.log("anything",anything)
        // const uniqueCities = [];
        // for (const key in anything) {
        //     const city = anything[key].city;
        //     if (city && !uniqueCities.includes(city)) {
        //         uniqueCities.push(city);
        //     }
        // }
        

    } catch (err) {
        console.log(err)
        return next({ msg: 3067 });
    }

}

module.exports = {
    howManyPropertiesAndProjectsInCity
};