/**
 * @file sessionService.js
 * 
 * @description 
 * Module quản lý session người dùng trong ứng dụng Express.  
 * 
 * Chức năng chính:
 * - Tạo session khi người dùng đăng nhập (`createSession`)
 * - Chuyển đổi vai trò đang hoạt động (`switchRole`)
 * - Lấy vai trò hiện tại (`getOngoingRole`)
 * - Xóa session khi người dùng đăng xuất (`destroySession`)
 * - Kiểm tra người dùng đã đăng nhập chưa (`isAuthenticated`)
 * - Lấy thông tin người dùng từ session (`getSessionUser`)
 * 
 * Lưu ý:
 * - `user.role` là vai trò đặc biệt từ DB (ví dụ: 'admin', 'shop', 'shipper', 'user').
 * - `ongoingRole` là vai trò đang hoạt động trong phiên đăng nhập, lưu trong session.
 * - Người dùng có thể chuyển giữa `'user'` và `user.role` nếu `user.role` khác `'user'`.
 * - Nếu `user.role === 'user'` → không thể chuyển `ongoingRole`.
 */

/**
 * @function createSession
 * @description 
 * Tạo session cho người dùng sau khi đăng nhập.
 * 
 * - Lưu `user.id` và `user.role` vào session để định danh người dùng.
 * - Khởi tạo `ongoingRole` mặc định là `'user'`.
 * - Nếu `user.role` là `'user'`, họ sẽ không thể chuyển vai trò.
 * 
 * @param {Object} req - Đối tượng request của Express.
 * @param {Object} user - Thông tin người dùng từ DB.
 * @param {number|string} user.id - ID duy nhất của người dùng.
 * @param {string} user.role - Vai trò đặc biệt từ DB (ví dụ: 'admin', 'shop', 'shipper').
 * 
 * @example
 * createSession(req, { id: 1, role: 'admin' });
 */
function createSession(req, user) {
    req.session.user = {
        id: user.id,
        role: user.role,
        ongoingRole: 'user'
    };
}

/**
 * @function switchRole
 * @description 
 * Chuyển đổi `ongoingRole` giữa `'user'` và role đặc biệt.
 * 
 * - Cho phép người dùng chuyển vai trò hoạt động trong phiên đăng nhập.
 * - Nếu `user.role` là `'user'` → không thể chuyển vai trò.
 * - Nếu `newRole` không phải `'user'` hoặc không trùng với `user.role` → không hợp lệ.
 * 
 * @param {Object} req - Đối tượng request của Express.
 * @param {string} newRole - Vai trò muốn chuyển sang (phải là `'user'` hoặc `user.role`).
 * @throws {Error} Nếu người dùng chưa đăng nhập, không có quyền chuyển hoặc `newRole` không hợp lệ.
 * 
 * @example
 * switchRole(req, 'admin');
 */
function switchRole(req, newRole) {
    const sessionUser = req.session.user;
    if (!sessionUser) throw new Error('User not logged in');

    // Nếu user không có role đặc biệt thì không được phép chuyển
    if (sessionUser.role === 'user') {
        throw new Error('This user has no alternative role to switch');
    }

    // Kiểm tra vai trò hợp lệ
    const validRoles = ['user', sessionUser.role];
    if (!validRoles.includes(newRole)) {
        throw new Error('Invalid role');
    }

    // Cập nhật ongoingRole
    sessionUser.ongoingRole = newRole;
}

/**
 * @function getOngoingRole
 * @description 
 * Lấy vai trò đang hoạt động hiện tại của người dùng từ session.
 * 
 * - Dùng khi bạn muốn biết user hiện đang hoạt động với vai trò nào.
 * - Giá trị này có thể thay đổi nếu họ dùng `switchRole()`.
 * 
 * @param {Object} req - Đối tượng request của Express.
 * @returns {string|null} Vai trò đang hoạt động (`'user'` hoặc role đặc biệt), hoặc `null` nếu chưa đăng nhập.
 * 
 * @example
 * const currentRole = getOngoingRole(req);
 */
function getOngoingRole(req) {
    return req.session?.user?.ongoingRole || null;
}

/**
 * @function destroySession
 * @description 
 * Hủy session khi người dùng đăng xuất.
 * 
 * - Xóa toàn bộ session hiện tại khỏi server.
 * - Nên gọi hàm này khi người dùng nhấn “Đăng xuất”.
 * 
 * @param {Object} req - Đối tượng request của Express.
 * @returns {Promise<void>} Promise hoàn thành khi session bị xóa.
 * 
 * @example
 * await destroySession(req);
 */
function destroySession(req) {
    return new Promise((resolve, reject) => {
        req.session.destroy(err => {
            if (err) return reject(err);
            resolve();
        });
    });
}

/**
 * @function isAuthenticated
 * @description 
 * Kiểm tra người dùng đã đăng nhập hay chưa.
 * 
 * - Dùng để bảo vệ các route cần đăng nhập.
 * - Nếu chưa đăng nhập, `req.session.user` sẽ không tồn tại.
 * 
 * @param {Object} req - Đối tượng request của Express.
 * @returns {boolean} `true` nếu user đã đăng nhập, ngược lại `false`.
 * 
 * @example
 * if (!isAuthenticated(req)) return res.status(401).send('Not authorized');
 */
function isAuthenticated(req) {
    return !!req.session?.user;
}

/**
 * @function getSessionUser
 * @description 
 * Lấy thông tin user từ session.
 * 
 * - Lấy dữ liệu người dùng đã lưu trong session mà không cần query DB.
 * - Thường dùng để hiển thị nhanh thông tin user hiện tại.
 * 
 * @param {Object} req - Đối tượng request của Express.
 * @returns {Object|null} Object chứa `id`, `role`, `ongoingRole` nếu có, hoặc `null` nếu chưa đăng nhập.
 * 
 * @example
 * const user = getSessionUser(req);
 * console.log(user.role);
 */
function getSessionUser(req) {
    return req.session?.user || null;
}

/**
 * @function setupSession
 * @description
 * Cấu hình middleware express-session với thời hạn 30 ngày và rolling = true.
 * 
 * - cookie.maxAge: 30 ngày
 * - rolling: true (mỗi request hợp lệ sẽ refresh hạn cookie)
 * - Nếu SESSION_SECRET không có, sẽ dùng chuỗi mặc định và cảnh báo trên console.
 * 
 * Gọi hàm này một lần trong quá trình khởi tạo app Express (trước khi mount routes).
 * 
 * @param {import('express').Express} app - Ứng dụng Express
 */
function setupSession(app) {
    const session = require('express-session');

    // Lấy secret từ .env, nếu không có thì fallback sang chuỗi mặc định
    let secret = process.env.SESSION_SECRET;

    if (!secret) {
        secret = 'dev_session_secret_change_me';
        console.error(
            '[⚠️ WARN] SESSION_SECRET is not set. Using a default secret. '
        );
    }

    app.use(
        session({
            secret,
            resave: false,
            saveUninitialized: false,
            rolling: true,
            cookie: {
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
            },
        })
    );
}

module.exports = {
    createSession,
    destroySession,
    isAuthenticated,
    getSessionUser,
    switchRole,
    getOngoingRole,
    setupSession
};
