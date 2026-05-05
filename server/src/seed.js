import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./db.js";
import Department from "./models/Department.js";
import Student from "./models/Student.js";
import Course from "./models/Course.js";
import Enrollment from "./models/Enrollment.js";

await connectDB();

await Promise.all([
  Department.deleteMany({}),
  Student.deleteMany({}),
  Course.deleteMany({}),
  Enrollment.deleteMany({})
]);

const [computerScience, business] = await Department.create([
  { name: "Computer Science", building: "Block A" },
  { name: "Business", building: "Block B" }
]);

const [anaya, rohan, meera] = await Student.create([
  {
    name: "Anaya Sharma",
    email: "anaya@example.com",
    year: 2,
    department: computerScience._id
  },
  {
    name: "Rohan Mehta",
    email: "rohan@example.com",
    year: 3,
    department: computerScience._id
  },
  {
    name: "Meera Iyer",
    email: "meera@example.com",
    year: 1,
    department: business._id
  }
]);

const [databaseSystems, webDevelopment, marketing] = await Course.create([
  { title: "Database Systems", code: "DBMS101", credits: 4 },
  { title: "Web Development", code: "WEB201", credits: 3 },
  { title: "Digital Marketing", code: "MKT110", credits: 3 }
]);

await Enrollment.create([
  { student: anaya._id, course: databaseSystems._id, semester: "Sem 3" },
  { student: anaya._id, course: webDevelopment._id, semester: "Sem 3" },
  { student: rohan._id, course: databaseSystems._id, semester: "Sem 5" },
  { student: meera._id, course: marketing._id, semester: "Sem 1" }
]);

console.log("Seed data inserted into college_crud_demo.");
await mongoose.disconnect();
