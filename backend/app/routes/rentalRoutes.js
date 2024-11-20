const express = require("express");
const router = express.Router();
const rentalController = require("../controllers/rentalController");

// Routes cho quản lý phòng trọ
router.get("/", rentalController.getRentals);
router.get("/:rental_id", rentalController.getRentalById);
router.post("/", rentalController.createRental);
router.put("/terminate/:rental_id", rentalController.terminateRental);
// Thêm thanh toán vào hợp đồng
router.post("/payments", rentalController.addPayment);

module.exports = router;
