import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const API_URL = "/api";

const emptyStudent = { name: "", email: "", year: 1, department: "" };
const emptyCourse = { title: "", code: "", credits: 3 };
const emptyDepartment = { name: "", building: "" };
const emptyEnrollment = { student: "", course: "", semester: "Sem 1" };

function App() {
  const [departments, setDepartments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [studentForm, setStudentForm] = useState(emptyStudent);
  const [courseForm, setCourseForm] = useState(emptyCourse);
  const [departmentForm, setDepartmentForm] = useState(emptyDepartment);
  const [enrollmentForm, setEnrollmentForm] = useState(emptyEnrollment);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);
  const [message, setMessage] = useState("");

  async function request(path, options) {
    const response = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Request failed");
    return data;
  }

  async function loadData() {
    const [departmentData, studentData, courseData, enrollmentData] = await Promise.all([
      request("/departments"),
      request("/students"),
      request("/courses"),
      request("/enrollments")
    ]);
    setDepartments(departmentData);
    setStudents(studentData);
    setCourses(courseData);
    setEnrollments(enrollmentData);
  }

  useEffect(() => {
    loadData().catch((error) => setMessage(error.message));
  }, []);

  const coursesByStudent = useMemo(() => {
    return enrollments.reduce((result, enrollment) => {
      const studentId = enrollment.student?._id;
      if (!studentId) return result;
      result[studentId] = [...(result[studentId] || []), enrollment.course?.code];
      return result;
    }, {});
  }, [enrollments]);

  async function saveDepartment(event) {
    event.preventDefault();
    const method = editingDepartmentId ? "PUT" : "POST";
    const path = editingDepartmentId ? `/departments/${editingDepartmentId}` : "/departments";
    await request(path, { method, body: JSON.stringify(departmentForm) });
    setDepartmentForm(emptyDepartment);
    setEditingDepartmentId(null);
    setMessage("Department saved");
    loadData();
  }

  async function saveStudent(event) {
    event.preventDefault();
    const method = editingStudentId ? "PUT" : "POST";
    const path = editingStudentId ? `/students/${editingStudentId}` : "/students";
    await request(path, { method, body: JSON.stringify(studentForm) });
    setStudentForm({ ...emptyStudent, department: departments[0]?._id || "" });
    setEditingStudentId(null);
    setMessage("Student saved");
    loadData();
  }

  async function saveCourse(event) {
    event.preventDefault();
    const method = editingCourseId ? "PUT" : "POST";
    const path = editingCourseId ? `/courses/${editingCourseId}` : "/courses";
    await request(path, { method, body: JSON.stringify(courseForm) });
    setCourseForm(emptyCourse);
    setEditingCourseId(null);
    setMessage("Course saved");
    loadData();
  }

  async function saveEnrollment(event) {
    event.preventDefault();
    try {
      await request("/enrollments", { method: "POST", body: JSON.stringify(enrollmentForm) });
      setEnrollmentForm({
        ...emptyEnrollment,
        student: students[0]?._id || "",
        course: courses[0]?._id || ""
      });
      setMessage("Enrollment saved");
      loadData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function remove(path, successMessage) {
    try {
      await request(path, { method: "DELETE" });
      setMessage(successMessage);
      loadData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function editDepartment(department) {
    setDepartmentForm({ name: department.name, building: department.building });
    setEditingDepartmentId(department._id);
  }

  function editStudent(student) {
    setStudentForm({
      name: student.name,
      email: student.email,
      year: student.year,
      department: student.department?._id || ""
    });
    setEditingStudentId(student._id);
  }

  function editCourse(course) {
    setCourseForm({ title: course.title, code: course.code, credits: course.credits });
    setEditingCourseId(course._id);
  }

  return (
    <main>
      <section className="top-bar">
        <div>
          <p className="eyebrow">React + MongoDB CRUD</p>
          <h1>College Relationship Manager</h1>
        </div>
        <span className="status">{message || "Connected to MongoDB local database"}</span>
      </section>

      <section className="relationship-strip">
        <article>
          <strong>One to Many</strong>
          <span>One department has many students. Each student stores one department id.</span>
        </article>
        <article>
          <strong>Many to Many</strong>
          <span>Students join many courses, and courses contain many students through enrollments.</span>
        </article>
      </section>

      <section className="grid two">
        <form onSubmit={saveDepartment} className="panel">
          <h2>{editingDepartmentId ? "Edit Department" : "Add Department"}</h2>
          <input
            placeholder="Department name"
            value={departmentForm.name}
            onChange={(event) => setDepartmentForm({ ...departmentForm, name: event.target.value })}
            required
          />
          <input
            placeholder="Building"
            value={departmentForm.building}
            onChange={(event) => setDepartmentForm({ ...departmentForm, building: event.target.value })}
            required
          />
          <button type="submit">{editingDepartmentId ? "Update" : "Add"} Department</button>
        </form>

        <div className="panel">
          <h2>Departments</h2>
          <div className="list">
            {departments.map((department) => (
              <div className="row" key={department._id}>
                <div>
                  <b>{department.name}</b>
                  <small>{department.building}</small>
                </div>
                <div className="actions">
                  <button type="button" onClick={() => editDepartment(department)}>Edit</button>
                  <button type="button" className="danger" onClick={() => remove(`/departments/${department._id}`, "Department deleted")}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid two">
        <form onSubmit={saveStudent} className="panel">
          <h2>{editingStudentId ? "Edit Student" : "Add Student"}</h2>
          <input
            placeholder="Student name"
            value={studentForm.name}
            onChange={(event) => setStudentForm({ ...studentForm, name: event.target.value })}
            required
          />
          <input
            placeholder="Email"
            type="email"
            value={studentForm.email}
            onChange={(event) => setStudentForm({ ...studentForm, email: event.target.value })}
            required
          />
          <input
            min="1"
            max="4"
            type="number"
            value={studentForm.year}
            onChange={(event) => setStudentForm({ ...studentForm, year: Number(event.target.value) })}
            required
          />
          <select
            value={studentForm.department}
            onChange={(event) => setStudentForm({ ...studentForm, department: event.target.value })}
            required
          >
            <option value="">Select department</option>
            {departments.map((department) => (
              <option value={department._id} key={department._id}>{department.name}</option>
            ))}
          </select>
          <button type="submit">{editingStudentId ? "Update" : "Add"} Student</button>
        </form>

        <div className="panel">
          <h2>Students</h2>
          <div className="list">
            {students.map((student) => (
              <div className="row" key={student._id}>
                <div>
                  <b>{student.name}</b>
                  <small>{student.department?.name} | Year {student.year} | Courses: {(coursesByStudent[student._id] || ["None"]).join(", ")}</small>
                </div>
                <div className="actions">
                  <button type="button" onClick={() => editStudent(student)}>Edit</button>
                  <button type="button" className="danger" onClick={() => remove(`/students/${student._id}`, "Student deleted")}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid two">
        <form onSubmit={saveCourse} className="panel">
          <h2>{editingCourseId ? "Edit Course" : "Add Course"}</h2>
          <input
            placeholder="Course title"
            value={courseForm.title}
            onChange={(event) => setCourseForm({ ...courseForm, title: event.target.value })}
            required
          />
          <input
            placeholder="Code"
            value={courseForm.code}
            onChange={(event) => setCourseForm({ ...courseForm, code: event.target.value })}
            required
          />
          <input
            min="1"
            max="6"
            type="number"
            value={courseForm.credits}
            onChange={(event) => setCourseForm({ ...courseForm, credits: Number(event.target.value) })}
            required
          />
          <button type="submit">{editingCourseId ? "Update" : "Add"} Course</button>
        </form>

        <div className="panel">
          <h2>Courses</h2>
          <div className="list">
            {courses.map((course) => (
              <div className="row" key={course._id}>
                <div>
                  <b>{course.code}</b>
                  <small>{course.title} | {course.credits} credits</small>
                </div>
                <div className="actions">
                  <button type="button" onClick={() => editCourse(course)}>Edit</button>
                  <button type="button" className="danger" onClick={() => remove(`/courses/${course._id}`, "Course deleted")}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid two">
        <form onSubmit={saveEnrollment} className="panel highlight">
          <h2>Add Enrollment</h2>
          <select
            value={enrollmentForm.student}
            onChange={(event) => setEnrollmentForm({ ...enrollmentForm, student: event.target.value })}
            required
          >
            <option value="">Select student</option>
            {students.map((student) => (
              <option value={student._id} key={student._id}>{student.name}</option>
            ))}
          </select>
          <select
            value={enrollmentForm.course}
            onChange={(event) => setEnrollmentForm({ ...enrollmentForm, course: event.target.value })}
            required
          >
            <option value="">Select course</option>
            {courses.map((course) => (
              <option value={course._id} key={course._id}>{course.code} - {course.title}</option>
            ))}
          </select>
          <input
            placeholder="Semester"
            value={enrollmentForm.semester}
            onChange={(event) => setEnrollmentForm({ ...enrollmentForm, semester: event.target.value })}
            required
          />
          <button type="submit">Enroll Student</button>
        </form>

        <div className="panel highlight">
          <h2>Enrollments</h2>
          <div className="list">
            {enrollments.map((enrollment) => (
              <div className="row" key={enrollment._id}>
                <div>
                  <b>{enrollment.student?.name}</b>
                  <small>{enrollment.course?.code} - {enrollment.course?.title} | {enrollment.semester}</small>
                </div>
                <button type="button" className="danger" onClick={() => remove(`/enrollments/${enrollment._id}`, "Enrollment deleted")}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
