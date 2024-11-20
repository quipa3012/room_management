const express = require("express");
const router = express.Router();
const tenantController = require("../controllers/tenantController");

// Routes cho quản lý người thuê
router.get("/", tenantController.getTenants); // Lấy danh sách người thuê
router.get("/deleted", tenantController.getTenantsDeleted);
router.put("/restore/:tenant_id", tenantController.restoreTenant);
router.get("/:tenant_id", tenantController.getTenantDetail); // Lấy chi tiết người thuê
router.post("/", tenantController.createTenant); // Thêm người thuê mới
router.put("/:tenant_id", tenantController.updateTenant); // Cập nhật thông tin người thuê
router.delete("/:tenant_id", tenantController.deleteTenant); // Xóa người thuê

module.exports = router;
