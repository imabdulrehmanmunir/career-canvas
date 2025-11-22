const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        let conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Mongo is connected successfully : ${conn.connection.host}`);
    } catch (error) {

        console.log(error);
        process.exit(1); // Exit process with failure

    }
}

module.exports = connectDB