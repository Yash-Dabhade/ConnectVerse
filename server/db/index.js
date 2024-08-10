import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}`
    );
    console.log(`DB connected!:${connectionInstance.connection.host}`);
  } catch (error) {
    console.log(error.message);
    console.log("DB connection failed");
    process.exit(1);
  }
};

export default connectDB;
