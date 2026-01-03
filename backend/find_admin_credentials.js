
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './src/config/db.js';
import User from './src/models/User.js';

dotenv.config();

const findAdmins = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        const admins = await User.find({ role: 'admin' }).select('username role fullName');

        if (admins.length === 0) {
            console.log('No admin users found in the database.');
        } else {
            console.log('Found Admin Users:');
            admins.forEach(admin => {
                console.log(`- Username: ${admin.username}, Name: ${admin.fullName}`);
            });
        }
    } catch (err) {
        console.error('Error finding admins:', err);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

findAdmins();
