import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log("DB connected successfully");
  } catch (error) {
    console.log("DB connection failed");
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;
