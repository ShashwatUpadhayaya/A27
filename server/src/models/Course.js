import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, uppercase: true },
    credits: { type: Number, required: true, min: 1, max: 6 }
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
