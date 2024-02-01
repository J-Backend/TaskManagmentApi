const mongoose = require('mongoose');

const db = async ()=>{
    try {
        const connection = await mongoose.connect(process.env.DB_URI)
        connection && console.log("Successfully db connection")
    } catch (error) {
        console.log("Error db connection")
    }
}

module.exports = db