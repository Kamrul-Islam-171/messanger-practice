
import mongoose from 'mongoose';

export const connectDb = async() => {
    try {
        const connect = await mongoose.connect(process.env.DB_URL);
        console.log(`Mongodb connected : ${connect.connection.host}`)
    } catch (error) {
        console.log(error);
        process.exit();
    }
}