const { PrismaClient } = require("@prisma/client")
const Response = require("../../../configuration/config.response")

const prisma = new PrismaClient()


const getAllArticles = async (req, res, next) => {
    console.log('===========================================')
    const { count, page, sort } = req.params
    const { articleCategoryId } = req.query

    let query = {};
    if (articleCategoryId) {
        query = {
            where: {
                articleCategoryId: parseInt(articleCategoryId)
            },
            take: parseInt(count),
            skip: (parseInt(page) - 1) * parseInt(count),
            orderBy: {
                createdon: sort
            },
            include: {
                articleCategory: true
            }
        }
    } else {
        query = {
            take: parseInt(count),
            skip: (parseInt(page) - 1) * parseInt(count),
            orderBy: {
                createdon: sort
            },
            include: {
                articleCategory: true
            }
        }
    }
    try {
        const data = await prisma.article.findMany(query);


        let allArticle = data.map((project) => {
            return {
                ...project,
            }
        })
        const articleCount = await prisma.article.findMany();


        let totalPages = (parseInt(articleCount.length) / parseInt(count))
        totalPages = Number.isInteger(totalPages) ? totalPages : parseInt(totalPages) + 1


        return Response.sendResponse(res, {
            msg: '703',
            data: {
                data: data,
                count: articleCount.length,
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

const getOneArticle = async (req, res, next) => {
    const { id } = req.params

    try {
        const data = await prisma.article.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                articleCategory: true
            }
        });
        if (data) {
            return Response.sendResponse(res, {
                msg: '703',
                data: {
                    data: data
                },
                lang: req.params.lang
            });
        } else {
            return res.status(500).json({
                "success": 0,
                "message": "Article Does Not Exist",
                "response": 500,
                "data": {}
            })
        }
    } catch (err) {
        console.log(err)
        return next({ msg: 3067 });
    }

}

const articleUploadImage = async (req, res, next) => {
    try {
        req.files = req.files.map(item => {
            if (item.location) {
                return item.location;
            }
            return false
        })
            .filter(item => {
                if (item) {
                    return item
                };
            });


        return Response.sendResponse(res, {
            msg: '0001',
            data: {
                urls: req.files
            },
            lang: req.params.lang
        });


    } catch (err) {
        console.log(err);
        return next({ msg: 700 })
    }

}

const createArticle = async (req, res, next) => {
    const { title, description, image, address, articleCategoryId, videoUrl } = req.body;

    try {
        const data = await prisma.article.create({
            data: {
                title,
                description,
                image,
                address,
                videoUrl,
                articleCategoryId
            },
            include: {
                articleCategory: true
            }
        })

        return Response.sendResponse(res, {
            msg: '701',
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

const updateArticle = async (req, res, next) => {
    const { id } = req.params
    const { ...dataToUpdate } = req.body;
    try {
        const data = await prisma.article.update({
            where: {
                id: parseInt(id)
            },
            data: {
                ...dataToUpdate
            },
            include: {
                articleCategory: true
            }

        })

        return Response.sendResponse(res, {
            msg: '702',
            data: data,
            lang: req.params.lang
        });

    } catch (err) {
        console.log(err);
        return next({ msg: 3067 });
    }

}

const deleteArticle = async (req, res, next) => {
    const { id } = req.params

    try {
        const data = await prisma.article.delete({
            where: {
                id: parseInt(id)
            },
            include: {
                articleCategory: true
            }
        })

        return Response.sendResponse(res, {
            msg: '704',
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

const createCategoryArticle = async (req, res, next) => {
    const { name } = req.body;
    try {
        const data = await prisma.articleCategory.create({
            data: {
                name
            },

        })

        return Response.sendResponse(res, {
            msg: '705',
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

module.exports = {
    articleUploadImage,
    createArticle,
    updateArticle,
    getAllArticles,
    getOneArticle,
    deleteArticle,
    createCategoryArticle
};