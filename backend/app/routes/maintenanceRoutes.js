const express = require("express");
const router = express.Router();
const maintenanceController = require("../controllers/maintenanceController");

// Route lấy lịch sử bảo trì của một phòng
router.get("/", maintenanceController.getMaintenanceHistory);

// Route lấy thông tin sửa chữa theo ID
router.get("/:maintenance_id", maintenanceController.getMaintenanceById);

// Route thêm lịch sử bảo trì mới
router.post("/", maintenanceController.addMaintenanceRecord);

// (Tùy chọn) Route cập nhật lịch sử bảo trì
router.put("/:maintenance_id", maintenanceController.updateMaintenance);

router.put(
  "/complete/:maintenance_id",
  maintenanceController.completeMaintenance
);

// (Tùy chọn) Route xóa lịch sử bảo trì
router.delete("/:maintenanceId", maintenanceController.deleteMaintenanceRecord);

module.exports = router;
