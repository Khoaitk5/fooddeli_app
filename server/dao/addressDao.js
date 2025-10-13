const GenericDao = require("./generic_dao");
const Address = require("../models/address");

/**
 * @class AddressDao
 * @extends GenericDao
 * @description Quản lý bảng `addresses`
 */
class AddressDao extends GenericDao {
  constructor() {
    super("addresses", Address);
  }

  // ⚡ Có thể thêm hàm đặc thù ở đây nếu cần
  // ví dụ: findByCity, findByDistrict, v.v.
}

module.exports = new AddressDao();
