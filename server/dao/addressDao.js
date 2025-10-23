const FirestoreDao = require("./firestore_dao");
const Address = require("../models/address");

/**
 * @class AddressDao
 * @extends FirestoreDao
 * @description Quản lý collection `addresses`
 */
class AddressDao extends FirestoreDao {
  constructor() {
    super("addresses", Address);
  }

  // Có thể thêm hàm đặc thù ở đây nếu cần
  // ví dụ: findByCity, findByDistrict, v.v.
}

module.exports = new AddressDao();
