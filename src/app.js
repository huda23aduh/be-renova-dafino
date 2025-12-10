import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import brandRoutes from "./routes/brand.routes.js";
import carRoutes from "./routes/car.routes.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // allow cookies / auth headers
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});


app.use("/auth", authRoutes);
app.use("/brands", brandRoutes);
app.use("/cars", carRoutes);

sequelize.sync({ alter: true }).then(() => {
  console.log("📦 Database synced!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
