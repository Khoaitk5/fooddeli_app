const shop_profileDao = require('../dao/shop_profileDao');

const shop_profileService = {
    async createShopProfile(profileData){
        return await shop_profileDao.create(profileData);
    },
    async getShopProfileById(profileId){
        return await shop_profileDao.findById(profileId);
    },
    async getAllShopProfiles(){
        return await shop_profileDao.findAll();
    },
    async updateShopProfile(profileId, updateData){
        return await shop_profileDao.update(profileId, updateData);
    },
    async deleteShopProfile(profileId){
        return await shop_profileDao.delete(profileId);
    }
};

module.exports = shop_profileService;
