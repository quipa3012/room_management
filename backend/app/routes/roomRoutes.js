const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");

router.get("/", roomController.getRooms);
router.get("/hollow", roomController.getRoomsHollow);
router.get("/:room_id", roomController.getRoomDetail);
router.post("/", roomController.createRoom);
router.put("/:room_id", roomController.updateRoom);
router.delete("/:room_id", roomController.deleteRoom);

module.exports = router;
