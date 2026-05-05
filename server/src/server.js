import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import departmentRoutes from "./routes/departments.js";
import studentRoutes from "./routes/students.js";
import courseRoutes from "./routes/courses.js";
import enrollmentRoutes from "./routes/enrollments.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "MongoDB CRUD Relationship API is running" });
});

app.use("/api/departments", departmentRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: error.message || "Server error" });
});

await connectDB();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
