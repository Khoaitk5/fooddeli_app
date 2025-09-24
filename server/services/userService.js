const userDao = require("../dao/userDao");

const userService = {
    async createUser(userData){
        return await userDao.create(userData);
    },
    async getUserById(userId){
        return await userDao.getById(userId);
    },
    async getAllUsers(){
        return await userDao.getAll();
    },
    async updateUser(userId, updateData){
        return await userDao.update(userId, updateData);
    },
    async deleteUser(userId){
        return await userDao.delete(userId);
    }
};

module.exports = userService;
