const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Đăng ký quản lý mới
exports.register = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Lỗi khi tạo người dùng" });
      }
      res.status(201).json({ message: "Tạo người dùng thành công!" });
    }
  );
};

// Đăng nhập quản lý
exports.login = (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, results) => {
      if (err || results.length === 0) {
        return res.status(400).json({ error: "Tên đăng nhập không tồn tại" });
      }

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Mật khẩu không đúng" });
      }

      const token = jwt.sign(
        { user_id: user.user_id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ message: "Đăng nhập thành công", token });
    }
  );
};
