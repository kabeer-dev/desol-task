const connectToMongoDb = require('../config/config');
const User = require('../models/user');
const { UserData } = require('./seederData')

const UserSeeder = async () => {
    try {
        await User.deleteMany();
        await User.create(UserData);
        console.log('User Data seeded successfully');
    } catch (err) {
        console.log('Error while adding admin data:', err);
    }
}

const seeders = async () => {
    try {
        await connectToMongoDb();
        await UserSeeder();
        process.exit();
    } catch (err) {
        console.log('Error in seeders:', err);
        process.exit(1); // Exit with error code 1
    }
}
seeders();

