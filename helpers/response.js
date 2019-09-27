const success = (messages, data)=>{
    return ({
        success: true,
        message: messages,
        result: data
    })
}

const error = (message, err, code ) => {
    return ({
        success: false,
        message: message,
        error: err,
        code: code
    })
}

module.exports = {success,error};
