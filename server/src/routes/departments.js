import express from "express";
import Department from "../models/Department.js";
import Student from "../models/Student.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const departments = await Department.find().sort({ name: 1 });
  res.json(departments);
});

router.post("/", async (req, res) => {
  const department = await Department.create(req.body);
  res.status(201).json(department);
});

router.put("/:id", async (req, res) => {
  const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.json(department);
});

router.delete("/:id", async (req, res) => {
  const usedByStudents = await Student.countDocuments({ department: req.params.id });
  if (usedByStudents > 0) {
    return res.status(400).json({ message: "Cannot delete: students belong to this department." });
  }

  await Department.findByIdAndDelete(req.params.id);
  res.json({ message: "Department deleted" });
});

export default router;
