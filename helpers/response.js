const success = (results, messages)=>{
    return{
        success: true,
        message: messages,
        result: results
    }
}

const error = (err)=>{
    return{
        success: false,
        error: err
    }
}

module.exports = {success,error};
