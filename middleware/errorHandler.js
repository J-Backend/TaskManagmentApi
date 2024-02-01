
const errorHandler = (err, req, res, next)=>{
    console.log("Error: ",err.stack)
    const status = res.stasusCode ? res.stasusCode : 500

    res.status(status)
    res.json({message:err.message})
}

module.exports = errorHandler