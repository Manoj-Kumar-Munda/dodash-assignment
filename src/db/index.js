import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://manoj:Manoj123@cluster0.rr0kduc.mongodb.net/Users"
    );
    console.log("Database connected");
  } catch (error) {
    console.log("Failed to establish database connection");
    process.exit(1);
  }
};

export default connectDb;
