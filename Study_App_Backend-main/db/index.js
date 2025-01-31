import mongoose from 'mongoose';

const Uri = process.env.MONGO_URI;

const connectDb = async ()=>{
    try {
        await mongoose.connect(Uri)
        .then(()=>{
            console.log("Connected to the database");
        })
        .catch((err)=>{
            console.error(err);
        });
    }
    catch(err){
        console.error(err);
    }
}

connectDb();

export default connectDb;