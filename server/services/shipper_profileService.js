const shipper_profileDao = require('../dao/shipper_profileDao');

const shipper_profileService = {
    async createShipperProfile(profileData){
        return await shipper_profileDao.create(profileData);
    },
    async getShipperProfileById(profileId){
        return await shipper_profileDao.getById(profileId);
    },
    async getAllShipperProfiles(){
        return await shipper_profileDao.getAll();
    },
    async updateShipperProfile(profileId, updateData){
        return await shipper_profileDao.update(profileId, updateData);
    },
    async deleteShipperProfile(profileId){
        return await shipper_profileDao.delete(profileId);
    }
};

module.exports = shipper_profileService;
