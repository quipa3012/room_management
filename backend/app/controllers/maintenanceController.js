const db = require("../config/db");

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

  const query = `
    SELECT * FROM maintenance
    WHERE maintenance_id = ?
  `;

  db.query(query, [maintenanceId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi khi lấy thông tin sửa chữa" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Lịch sử sửa chữa không tồn tại" });
    }

    res.json(results[0]);
  });
};

exports.addMaintenanceRecord = (req, res) => {
  const { room_id, description, expense } = req.body;

  if (!room_id || !description || typeof expense !== "number") {
    return res
      .status(400)
      .json({ error: "Vui lòng điền đầy đủ thông tin hợp lệ" });
  }

  const query = `
    INSERT INTO maintenance (room_id, description, expense)
    VALUES (?, ?, ?)
  `;

  db.query(query, [room_id, description, expense], (err, result) => {
    if (err) {
      console.error("Lỗi khi thêm lịch sử sửa chữa:", err);
      return res.status(500).json({ error: "Lỗi khi thêm lịch sử sửa chữa" });
    }

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

exports.updateMaintenance = (req, res) => {
  const maintenanceId = req.params.maintenance_id;
  const { description, expense } = req.body;

  if (!description || typeof expense !== "number") {
    return res.status(400).json({ error: "Mô tả và chi phí là bắt buộc" });
  }

  const query = `
    UPDATE maintenance 
    SET description = ?, expense = ?
    WHERE maintenance_id = ?
  `;

  db.query(query, [description, expense, maintenanceId], (err, result) => {
    if (err) {
      console.error("Lỗi khi cập nhật lịch sử bảo trì:", err);
      return res
        .status(500)
        .json({ error: "Lỗi khi cập nhật lịch sử bảo trì" });
    }

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Cập nhật thành công" });
    } else {
      return res.status(404).json({ error: "Không tìm thấy lịch sử bảo trì" });
    }
  });
};

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
