const db = require("../config/db");

// Lấy danh sách tất cả các hợp đồng
exports.getRentals = (req, res) => {
  const query = `
    SELECT rentals.*, 
           tenants.full_name AS tenant_name, 
           tenants.phone_number, 
           tenants.gender, 
           tenants.date_of_birth, 
           rooms.room_id, 
           rooms.price AS room_price
    FROM rentals
    LEFT JOIN tenants ON rentals.tenant_id = tenants.tenant_id
    LEFT JOIN rooms ON rentals.room_id = rooms.room_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi khi lấy danh sách hợp đồng" });
    }
    res.json(results);
  });
};

exports.getRentalById = (req, res) => {
  const rentalId = req.params.rental_id;

  const query = `
    SELECT rentals.*, 
           tenants.full_name AS tenant_name, 
           tenants.phone_number, 
           tenants.gender, 
           tenants.date_of_birth, 
           rooms.room_id, 
           rooms.price AS room_price
    FROM rentals
    LEFT JOIN tenants ON rentals.tenant_id = tenants.tenant_id
    LEFT JOIN rooms ON rentals.room_id = rooms.room_id
    WHERE rentals.rental_id = ?
  `;

  db.query(query, [rentalId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi khi lấy chi tiết hợp đồng" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy hợp đồng" });
    }

    // Lấy danh sách thanh toán của hợp đồng
    const paymentQuery = `
      SELECT payments.payment_id, 
             payments.payment_date, 
             payments.amount
      FROM payments
      WHERE payments.rental_id = ?
    `;

    db.query(paymentQuery, [rentalId], (err, paymentResults) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Lỗi khi lấy danh sách thanh toán" });
      }

      // Thêm danh sách thanh toán vào kết quả hợp đồng
      results[0].payments = paymentResults;
      res.json(results[0]);
    });
  });
};

// Chấm dứt hợp đồng
exports.terminateRental = (req, res) => {
  const rentalId = req.params.rental_id;

  // Bước 1: Lấy thông tin phòng từ hợp đồng để cập nhật trạng thái phòng
  const getRoomQuery = "SELECT room_id FROM rentals WHERE rental_id = ?";

  db.query(getRoomQuery, [rentalId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi khi lấy thông tin phòng" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Hợp đồng không tìm thấy" });
    }

    const roomId = results[0].room_id;

    // Bước 2: Cập nhật trạng thái hợp đồng thành "không hiệu lực"
    const updateRentalQuery =
      'UPDATE rentals SET status = "không hiệu lực" WHERE rental_id = ?';

    db.query(updateRentalQuery, [rentalId], (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Lỗi khi cập nhật trạng thái hợp đồng" });
      }

      // Bước 3: Cập nhật trạng thái phòng thành "đang trống"
      const updateRoomQuery =
        'UPDATE rooms SET status = "đang trống" WHERE room_id = ?';

      db.query(updateRoomQuery, [roomId], (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Lỗi khi cập nhật trạng thái phòng" });
        }

        res.json({
          message:
            "Hợp đồng đã được chấm dứt và trạng thái phòng đã được cập nhật thành 'đang trống'",
        });
      });
    });
  });
};

// Thêm thanh toán mới vào hợp đồng
exports.addPayment = (req, res) => {
  const { rental_id, amount } = req.body;
  const paymentDate = new Date();

  // Kiểm tra nếu amount không phải là số dương
  if (amount <= 0) {
    return res.status(400).json({ error: "Số tiền thanh toán phải lớn hơn 0" });
  }

  const query = `
    INSERT INTO payments (rental_id, payment_date, amount)
    VALUES (?, ?, ?)
  `;

  db.query(query, [rental_id, paymentDate, amount], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi khi thêm thanh toán" });
    }
    res.status(201).json({
      payment_id: results.insertId,
      rental_id,
      payment_date: paymentDate,
      amount,
    });
  });
};

// Tạo hợp đồng mới
exports.createRental = (req, res) => {
  const { room_id, tenant_id, start_date, end_date, deposit, status } =
    req.body;

  // Kiểm tra nếu thiếu thông tin bắt buộc
  if (
    !room_id ||
    !tenant_id ||
    !start_date ||
    !end_date ||
    !deposit ||
    typeof status === "undefined"
  ) {
    return res.status(400).json({ error: "Vui lòng điền đầy đủ thông tin" });
  }

  // Kiểm tra xem phòng có trạng thái "đang trống" không
  const checkRoomQuery =
    'SELECT * FROM rooms WHERE room_id = ? AND status = "đang trống"';

  db.query(checkRoomQuery, [room_id], (err, results) => {
    if (err) {
      console.error("Lỗi khi kiểm tra phòng:", err); // Log thêm lỗi để dễ kiểm tra
      return res.status(500).json({ error: "Lỗi khi kiểm tra phòng" });
    }

    // Nếu không tìm thấy phòng trống
    if (results.length === 0) {
      return res
        .status(400)
        .json({ error: "Phòng này không trống hoặc không tồn tại" });
    }

    // Lấy giá phòng từ bảng rooms
    const room = results[0];
    const rental_price = room.price; // Giả sử trường giá phòng là 'price' trong bảng rooms

    // Nếu phòng đang có người thuê
    if (room.status !== "đang trống") {
      return res
        .status(400)
        .json({ error: "Phòng này không còn trống để thuê" });
    }

    // Nếu phòng hợp lệ, tiếp tục tạo hợp đồng
    const createRentalQuery = `
      INSERT INTO rentals (room_id, tenant_id, start_date, end_date, deposit, rental_price, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      createRentalQuery,
      [room_id, tenant_id, start_date, end_date, deposit, rental_price, status],
      (err, results) => {
        if (err) {
          console.error("Lỗi khi tạo hợp đồng:", err); // Log thêm lỗi để dễ kiểm tra
          return res.status(500).json({ error: "Lỗi khi tạo hợp đồng" });
        }

        // Lấy ID của hợp đồng mới tạo
        const rentalId = results.insertId;

        // Cập nhật trạng thái phòng thành "đang thuê"
        const updateRoomQuery = `
          UPDATE rooms
          SET status = "đang thuê"
          WHERE room_id = ?
        `;

        db.query(updateRoomQuery, [room_id], (err, updateResults) => {
          if (err) {
            console.error("Lỗi khi cập nhật trạng thái phòng:", err); // Log thêm lỗi để dễ kiểm tra
            return res
              .status(500)
              .json({ error: "Lỗi khi cập nhật trạng thái phòng" });
          }

          // Trả về ID của hợp đồng đã tạo và thông báo thành công
          res.status(201).json({
            rental_id: rentalId,
            message:
              "Hợp đồng đã được tạo thành công và trạng thái phòng đã được cập nhật!",
          });
        });
      }
    );
  });
};
