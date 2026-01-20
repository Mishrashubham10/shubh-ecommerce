import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MONGODB CONNECTED !! ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed');
    console.error(error.message);

    // Exit process if DB fails (VERY IMPORTANT)
    process.exit(1);
  }
};

export default connectDB;