const { PrismaClient } = require("@prisma/client")
const Response = require("../../../configuration/config.response")

const prisma = new PrismaClient();


const getAll = async (req, res, next) => {
    try {
        const data = await prisma.Language.findMany({
           select: {
            id: true,
            lang:true,
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





module.exports = {
    getAll,
};