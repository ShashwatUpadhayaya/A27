import express from "express";
import Enrollment from "../models/Enrollment.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const enrollments = await Enrollment.find()
    .populate("student")
    .populate("course")
    .sort({ createdAt: -1 });
  res.json(enrollments);
});

router.post("/", async (req, res) => {
  try {
    const enrollment = await Enrollment.create(req.body);
    const saved = await enrollment.populate(["student", "course"]);
    res.status(201).json(saved);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "This student is already enrolled in this course." });
    }
    throw error;
  }
});

router.put("/:id", async (req, res) => {
  const enrollment = await Enrollment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
    .populate("student")
    .populate("course");
  res.json(enrollment);
});

router.delete("/:id", async (req, res) => {
  await Enrollment.findByIdAndDelete(req.params.id);
  res.json({ message: "Enrollment deleted" });
});

export default router;
