
const errorResponse = async (error) => {
    console.log('in error response here ->',error);
    return {
        param: error.param,
        message: error.msg,
        value: error.value,
        location: error.location,
        nestedErrors: error.nestedErrors,
    };
};

module.exports = {
    errorResponse
}