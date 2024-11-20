const db = require("../config/db");

// Lấy danh sách các phòng trọ
exports.getRooms = (req, res) => {
  const query = `
    SELECT rooms.*, maintenance.status AS maintenance_status
FROM rooms
LEFT JOIN (
    SELECT room_id, status
    FROM maintenance
    WHERE (room_id, maintenance_date) IN (
        SELECT room_id, MAX(maintenance_date)
        FROM maintenance
        GROUP BY room_id
    )
) AS maintenance ON rooms.room_id = maintenance.room_id;

  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi khi lấy danh sách phòng trọ" });
    }
    res.json(results);
  });
};

// Thêm phòng trọ mới
exports.createRoom = (req, res) => {
  const { room_id, capacity, price, status } = req.body;

  db.query(
    "INSERT INTO rooms (room_id, capacity, price, status) VALUES (?, ?, ?, ?)",
    [room_id, capacity, price, status || "đang trống"],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Lỗi khi thêm phòng trọ mới" });
      }
      res.status(201).json({ message: "Thêm phòng trọ thành công!" });
    }
  );
};

// Hàm cập nhật thông tin phòng
exports.updateRoom = (req, res) => {
  const roomId = req.params.room_id;
  const { capacity, price } = req.body;

  // Kiểm tra xem phòng có tồn tại hay không
  db.query("SELECT * FROM rooms WHERE room_id = ?", [roomId], (err, result) => {
    if (err) {
      console.error("Lỗi khi truy vấn dữ liệu:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Phòng không tồn tại" });
    }

    // Cập nhật sức chứa và giá phòng
    db.query(
      "UPDATE rooms SET capacity = ?, price = ? WHERE room_id = ?",
      [capacity, price, roomId],
      (err, result) => {
        if (err) {
          console.error("Lỗi khi cập nhật phòng:", err);
          return res.status(500).json({ error: "Lỗi khi cập nhật phòng" });
        }
        return res.status(200).json({ message: "Cập nhật phòng thành công" });
      }
    );
  });
};

// Xóa phòng trọ
exports.deleteRoom = (req, res) => {
  const { room_id } = req.params;

  db.query("DELETE FROM rooms WHERE room_id = ?", [room_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi khi xóa phòng trọ" });
    }
    res.json({ message: "Xóa phòng trọ thành công!" });
  });
};

// Xem chi tiết phòng
exports.getRoomDetail = (req, res) => {
  const roomId = req.params.room_id;

  // Câu lệnh SQL với JOIN
  const query = `
    SELECT rooms.*, rentals.rental_id, rentals.start_date, rentals.end_date, rentals.rental_price, 
           tenants.tenant_id, tenants.full_name, tenants.phone_number, tenants.date_of_birth, tenants.gender
    FROM rooms
    LEFT JOIN rentals ON rooms.room_id = rentals.room_id
    LEFT JOIN tenants ON rentals.tenant_id = tenants.tenant_id
    WHERE rooms.room_id = ?`;

  db.query(query, [roomId], (err, results) => {
    if (err) {
      console.error("Lỗi khi truy vấn cơ sở dữ liệu:", err);
      return res.status(500).json({ error: "Lỗi hệ thống" });
    }
    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "Phòng không tồn tại hoặc chưa có hợp đồng thuê" });
    }

    res.json(results[0]); // Trả về chi tiết phòng, hợp đồng và thông tin người thuê
  });
};

// Lấy danh sách phòng "đang trống"
exports.getRoomsHollow = (req, res) => {
  const query = `SELECT * FROM rooms WHERE status = 'đang trống'`;
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi khi lấy danh sách phòng" });
    }
    res.json(results);
  });
};
