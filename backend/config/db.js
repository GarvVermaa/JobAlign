const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:270717/jobalign", {
      useNewURLParses: true,
      useUnfiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error('MongoDB connection error:',error);
    process.exit(1);
  }
};

module.exports=connectDB;