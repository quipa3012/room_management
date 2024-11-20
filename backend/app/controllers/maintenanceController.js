const db = require("../config/db"); // Đảm bảo file database.js đã được cấu hình cho MySQL

// Lấy lịch sử bảo trì cho một phòng cụ thể
exports.getMaintenanceHistory = async (req, res) => {
  db.query(
    "SELECT * FROM maintenance ORDER BY maintenance_date DESC",
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Lỗi khi lấy danh sách lịch sử sữa chữa" });
      }
      res.json(results);
    }
  );
};

exports.getMaintenanceById = (req, res) => {
  const maintenanceId = req.params.maintenance_id;

  // Truy vấn dữ liệu từ cơ sở dữ liệu
  const query = `
    SELECT * FROM maintenance
    WHERE maintenance_id = ?
  `;

  db.query(query, [maintenanceId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi khi lấy thông tin sửa chữa" });
    }

    // Kiểm tra nếu không có kết quả
    if (results.length === 0) {
      return res.status(404).json({ error: "Lịch sử sửa chữa không tồn tại" });
    }

    // Trả về dữ liệu sửa chữa
    res.json(results[0]);
  });
};

// Thêm mới lịch sử bảo trì cho một phòng
exports.addMaintenanceRecord = (req, res) => {
  const { room_id, description, expense } = req.body;

  // Kiểm tra nếu thiếu thông tin bắt buộc
  if (!room_id || !description || typeof expense !== "number") {
    return res
      .status(400)
      .json({ error: "Vui lòng điền đầy đủ thông tin hợp lệ" });
  }

  // Câu lệnh SQL để thêm bản ghi vào bảng maintenance
  const query = `
    INSERT INTO maintenance (room_id, description, expense)
    VALUES (?, ?, ?)
  `;

  // Thực hiện truy vấn SQL
  db.query(query, [room_id, description, expense], (err, result) => {
    if (err) {
      console.error("Lỗi khi thêm lịch sử sửa chữa:", err);
      return res.status(500).json({ error: "Lỗi khi thêm lịch sử sửa chữa" });
    }

    // Kiểm tra nếu có bản ghi nào được thêm vào
    if (result.affectedRows > 0) {
      return res.status(201).json({
        message: "Thêm lịch sử sửa chữa thành công!",
        maintenanceId: result.insertId,
      });
    } else {
      return res.status(400).json({ error: "Lỗi khi thêm lịch sử sửa chữa" });
    }
  });
};

// (Tùy chọn) Cập nhật lịch sử bảo trì
exports.updateMaintenance = (req, res) => {
  const maintenanceId = req.params.maintenance_id;
  const { description, expense } = req.body;

  if (!description || typeof expense !== "number") {
    return res.status(400).json({ error: "Mô tả và chi phí là bắt buộc" });
  }

  // Câu lệnh SQL để cập nhật thông tin bảo trì
  const query = `
    UPDATE maintenance 
    SET description = ?, expense = ?
    WHERE maintenance_id = ?
  `;

  // Thực hiện truy vấn cập nhật
  db.query(query, [description, expense, maintenanceId], (err, result) => {
    if (err) {
      console.error("Lỗi khi cập nhật lịch sử bảo trì:", err);
      return res
        .status(500)
        .json({ error: "Lỗi khi cập nhật lịch sử bảo trì" });
    }

    // Kiểm tra xem có bản ghi nào được cập nhật không
    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Cập nhật thành công" });
    } else {
      return res.status(404).json({ error: "Không tìm thấy lịch sử bảo trì" });
    }
  });
};

// (Tùy chọn) Xóa lịch sử bảo trì
exports.deleteMaintenanceRecord = async (req, res) => {
  const { maintenanceId } = req.params;

  try {
    const [result] = await db.execute(
      "DELETE FROM maintenance WHERE maintenance_id = ?",
      [maintenanceId]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy lịch sử bảo trì cần xóa." });
    }

    res.json({ message: "Xóa lịch sử bảo trì thành công." });
  } catch (error) {
    console.error("Lỗi khi xóa lịch sử bảo trì:", error);
    res.status(500).json({ message: "Lỗi server." });
  }
};

// maintenanceController.js
exports.completeMaintenance = (req, res) => {
  const maintenanceId = req.params.maintenance_id;

  const query = `
    UPDATE maintenance
    SET status = 1
    WHERE maintenance_id = ?
  `;

  db.query(query, [maintenanceId], (err, result) => {
    if (err) {
      console.error("Lỗi khi hoàn tất sửa chữa:", err);
      return res.status(500).json({ error: "Lỗi khi hoàn tất sửa chữa" });
    }

    if (result.affectedRows > 0) {
      return res.status(200).json({
        message: "Lịch sử sửa chữa đã được hoàn thành!",
      });
    } else {
      return res
        .status(400)
        .json({ error: "Không tìm thấy lịch sử sửa chữa." });
    }
  });
};
