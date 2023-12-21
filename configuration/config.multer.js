const { S3Client } = require('@aws-sdk/client-s3'),
    multer = require('multer'),
    multerS3 = require('multer-s3'),
    Response = require('./config.response');


let upload = (dirName) => {
    const s3 = new S3Client(
        {
            credentials: {
                accessKeyId: config.aws.s3.accessKeyId,
                secretAccessKey: config.aws.s3.secretAccessKey,
            },
            region: config.aws.s3.region
        }
    );
    let mimitype = '';
    return multer({
        storage: multerS3({
            s3: s3,
            bucket: config.aws.s3.bucket,
            cacheControl: config.aws.s3.cacheControl,
            region: config.aws.s3.region,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            acl: 'public-read',
            metadata: function (req, file, cb) {
                console.log("meta data is here");
                cb(null, {
                    fieldName: file.fieldname
                });
            },
            key: function (req, file, cb) {
                console.log("key is here")
                var newFileName = dirName + '/' + Date.now() + '-' + file.originalname;
                cb(null, newFileName);
            }
        }),
    });
};


let uploadImageResponse = (req, res, next) => {
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
        return next({ msg: 2 })
    }
};

module.exports = {
    upload,
    uploadImageResponse
};

