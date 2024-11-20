const db = require("../config/db");

// Lấy danh sách tất cả người thuê phòng
exports.getTenants = (req, res) => {
  db.query("SELECT * FROM tenants WHERE is_delete = 0", (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Lỗi khi lấy danh sách người thuê" });
    }
    res.json(results);
  });
};

// Lấy danh sách tất cả người thuê phòng đã xóa
exports.getTenantsDeleted = (req, res) => {
  db.query("SELECT * FROM tenants WHERE is_delete = 1", (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Lỗi khi lấy danh sách người thuê" });
    }
    res.json(results);
  });
};

// Khôi phục thành viên
exports.restoreTenant = (req, res) => {
  const tenantId = req.params.tenant_id;

  const query = `UPDATE tenants SET is_delete = 0 WHERE tenant_id = ?`;

  db.query(query, [tenantId], (err, result) => {
    if (err) {
      console.error("Lỗi khi khôi phục thành viên:", err);
      return res.status(500).json({ error: "Lỗi khi khôi phục thành viên" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Không tìm thấy thành viên" });
    }
    res.json({ message: "Khôi phục thành viên thành công!" });
  });
};

// Thêm người thuê mới
exports.createTenant = (req, res) => {
  const { tenant_id, full_name, phone_number, date_of_birth, gender } =
    req.body;

  // Kiểm tra nếu thiếu thông tin bắt buộc
  if (
    !tenant_id ||
    !full_name ||
    !phone_number ||
    !date_of_birth ||
    typeof gender === "undefined"
  ) {
    return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin" });
  }

  const query = `
    INSERT INTO tenants (tenant_id, full_name, phone_number, date_of_birth, gender)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [tenant_id, full_name, phone_number, date_of_birth, gender],
    (err, result) => {
      if (err) {
        console.error("Lỗi khi thêm thành viên mới:", err);
        return res.status(500).json({ error: "Lỗi khi thêm thành viên mới" });
      }
      res.status(201).json({ message: "Thêm thành viên thành công!" });
    }
  );
};

// Chỉnh sửa thông tin thành viên
exports.updateTenant = (req, res) => {
  const { tenant_id } = req.params;
  const { full_name, phone_number, date_of_birth, gender } = req.body;

  // Kiểm tra nếu thiếu thông tin bắt buộc
  if (
    !full_name ||
    !phone_number ||
    !date_of_birth ||
    typeof gender === "undefined"
  ) {
    return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin" });
  }

  const query = `
    UPDATE tenants
    SET full_name = ?, phone_number = ?, date_of_birth = ?, gender = ?
    WHERE tenant_id = ?
  `;

  db.query(
    query,
    [full_name, phone_number, date_of_birth, gender, tenant_id],
    (err, results) => {
      if (err) {
        console.error("Lỗi khi cập nhật thông tin thành viên:", err);
        return res
          .status(500)
          .json({ error: "Lỗi khi cập nhật thông tin thành viên" });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Không tìm thấy thành viên" });
      }
      res.json({ message: "Cập nhật thông tin thành viên thành công!" });
    }
  );
};

// Xóa người thuê (chỉ thay đổi trạng thái is_delete)
exports.deleteTenant = (req, res) => {
  const { tenant_id } = req.params;

  db.query(
    "UPDATE tenants SET is_delete = 1 WHERE tenant_id = ?",
    [tenant_id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Lỗi khi xóa người thuê" });
      }
      res.json({ message: "Xóa người thuê thành công!" });
    }
  );
};

// Xem chi tiết người thuê
exports.getTenantDetail = (req, res) => {
  const tenantId = req.params.tenant_id;

  // Truy vấn để lấy thông tin thành viên và thông tin hợp đồng, phòng mà họ đang thuê
  const query = `
    SELECT 
      tenants.tenant_id,
      tenants.full_name,
      tenants.phone_number,
      tenants.date_of_birth,
      tenants.gender,
      rentals.rental_id,
      rentals.start_date,
      rentals.end_date,
      rentals.rental_price,
      rentals.deposit,
      rooms.room_id,
      rooms.capacity,
      rooms.price AS room_price,
      rooms.status AS room_status
    FROM 
      tenants
    LEFT JOIN 
      rentals ON tenants.tenant_id = rentals.tenant_id
    LEFT JOIN 
      rooms ON rentals.room_id = rooms.room_id
    WHERE 
      tenants.tenant_id = ?
  `;

  db.query(query, [tenantId], (err, results) => {
    if (err) {
      console.error("Lỗi khi truy vấn cơ sở dữ liệu:", err);
      return res.status(500).json({ error: "Lỗi hệ thống" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Thành viên không tồn tại" });
    }
    res.json(results[0]); // Trả về chi tiết thành viên
  });
};
