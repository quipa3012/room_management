const express = require("express");
const router = express.Router();
const maintenanceController = require("../controllers/maintenanceController");

router.get("/", maintenanceController.getMaintenanceHistory);
router.get("/:maintenance_id", maintenanceController.getMaintenanceById);
router.post("/", maintenanceController.addMaintenanceRecord);
router.put("/:maintenance_id", maintenanceController.updateMaintenance);
router.put(
  "/complete/:maintenance_id",
  maintenanceController.completeMaintenance
);
router.delete("/:maintenanceId", maintenanceController.deleteMaintenanceRecord);

module.exports = router;
