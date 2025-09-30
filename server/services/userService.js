const userDao = require("../dao/userDao");

const userService = {
    async createUser(userData){
        return await userDao.create(userData);
    },
    async getUserById(userId){
        return await userDao.findById(userId);
    },
    async getAllUsers(){
        return await userDao.findAll();
    },
    async updateUser(userId, updateData){
        return await userDao.update(userId, updateData);
    },
    async deleteUser(userId){
        return await userDao.delete(userId);
    }
};

module.exports = userService;
