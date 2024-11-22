const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const authRoutes = require("./app/routes/authRoutes");
const roomRoutes = require("./app/routes/roomRoutes");
const rentalRoutes = require("./app/routes/rentalRoutes");
const tenantRoutes = require("./app/routes/tenantRoutes");
const maintenanceRoutes = require("./app/routes/maintenanceRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/maintenance", maintenanceRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
