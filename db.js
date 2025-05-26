const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://Bambinton:ex.Bambala3000@cluster0.kamvzuj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
   try {
       await mongoose.connect(mongoURI);
       console.log('MongoDB connected successfully');
   } catch (err) {
       console.error('Database connection failed:', err);
   }
};

module.exports = connectDB;