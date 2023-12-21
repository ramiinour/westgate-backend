const passport = require('passport');
const { authenticate } = require('../../../configuration/config.jwt');
const articleController = require('./../controllers/article.controllers')
upload = require('../../../configuration/config.multer'),
    partnerImage = upload.upload(config.aws.s3.article);

module.exports = (app, version) => {
    let moduleName = '/article';
    console.log("Hello from article routes");


    app.get(
        version + moduleName + '/allArticle/:count/:page/:sort',
        // authenticate,
        articleController.getAllArticles
    );

    app.get(
        version + moduleName + '/getOneArticle/:id',
        // authenticate,
        articleController.getOneArticle
    );

    app.post(
        version + moduleName + '/uploadImage',
        authenticate,
        partnerImage.array('image', 10),
        articleController.articleUploadImage
    );

    app.post(
        version + moduleName + '/createArticle',
        authenticate,
        articleController.createArticle
    )

    app.post(
        version + moduleName + '/createCategoryArticle',
        // authenticate,
        articleController.createCategoryArticle
    )

    app.put(
        version + moduleName + '/updateArticle/:id',
        authenticate,
        articleController.updateArticle
    )

    app.delete(
        version + moduleName + '/deleteArticle/:id',
        authenticate,
        articleController.deleteArticle
    )

};