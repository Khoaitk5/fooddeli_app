// dao/cart_itemDao.js
const GenericDao = require("./generic_dao");
const CartItem = require("../models/cart_item");
const pool = require("../config/db");

class CartItemDao extends GenericDao {
  constructor() {
    // Gọi constructor của GenericDao với tên bảng và model tương ứng
    super("cart_items", CartItem);
  }

  async findByCartShopProduct(cartId, shopId, productId) {
    const query = `
      SELECT *
      FROM cart_items
      WHERE cart_id = $1 AND shop_id = $2 AND product_id = $3
      LIMIT 1;
    `;
    const result = await pool.query(query, [cartId, shopId, productId]);
    return result.rows[0] ? new CartItem(result.rows[0]) : null;
  }

  /**
   * Lấy tất cả cart items theo cart_id
   * @param {number} cartId - ID giỏ hàng
   * @returns {Promise<object[]>} - Danh sách các cart_item
   */
  async getByCartId(cartId) {
    const query = `
    SELECT 
      ci.id AS cart_item_id,
      ci.cart_id,
      ci.shop_id,
      ci.product_id,
      ci.quantity,
      ci.unit_price,
      ci.line_total,
      ci.created_at,
      ci.updated_at,
      p.name AS product_name,
      p.description AS product_description,
      p.image_url AS product_image,
      p.price AS product_price,
      p.category,
      s.shop_name,
      u.avatar_url AS shop_avatar
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.product_id
    JOIN shop_profiles s ON p.shop_id = s.id
    JOIN users u ON s.user_id = u.id
    WHERE ci.cart_id = $1
    ORDER BY ci.created_at DESC;
  `;
    const result = await pool.query(query, [cartId]);
    return result.rows;
  }
}

// Export một instance để sử dụng ở service/controller
module.exports = new CartItemDao();
