import express from "express";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const courses = await Course.find().sort({ code: 1 });
  res.json(courses);
});

router.post("/", async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).json(course);
});

router.put("/:id", async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.json(course);
});

router.delete("/:id", async (req, res) => {
  await Enrollment.deleteMany({ course: req.params.id });
  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: "Course and related enrollments deleted" });
});

export default router;
