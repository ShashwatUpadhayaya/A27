import express from "express";
import Student from "../models/Student.js";
import Enrollment from "../models/Enrollment.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const students = await Student.find()
    .populate("department")
    .sort({ createdAt: -1 });
  res.json(students);
});

router.post("/", async (req, res) => {
  const student = await Student.create(req.body);
  const saved = await student.populate("department");
  res.status(201).json(saved);
});

router.put("/:id", async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate("department");
  res.json(student);
});

router.delete("/:id", async (req, res) => {
  await Enrollment.deleteMany({ student: req.params.id });
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Student and related enrollments deleted" });
});

export default router;
