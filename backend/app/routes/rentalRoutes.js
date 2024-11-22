const express = require("express");
const router = express.Router();
const rentalController = require("../controllers/rentalController");

router.get("/", rentalController.getRentals);
router.get("/:rental_id", rentalController.getRentalById);
router.post("/", rentalController.createRental);
router.put("/terminate/:rental_id", rentalController.terminateRental);
router.post("/payments", rentalController.addPayment);

module.exports = router;
