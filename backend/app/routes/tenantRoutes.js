const express = require("express");
const router = express.Router();
const tenantController = require("../controllers/tenantController");

router.get("/", tenantController.getTenants);
router.get("/deleted", tenantController.getTenantsDeleted);
router.put("/restore/:tenant_id", tenantController.restoreTenant);
router.get("/:tenant_id", tenantController.getTenantDetail);
router.post("/", tenantController.createTenant);
router.put("/:tenant_id", tenantController.updateTenant);
router.delete("/:tenant_id", tenantController.deleteTenant);

module.exports = router;
