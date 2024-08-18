// require('dotenv').config()
import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
let courses = [];
let nextId = 1;

// all courses
app.post("/allCourses", (req, res) => {
  const { name, price } = req.body;
  const newCourse = { id: nextId++, name, price };
  courses.push(newCourse);
  res.status(200).send(newCourse);
});

// get all courses
app.get("/allCourses", (req, res) => {
  res.status(200).send(courses);
});

// get course with id
app.get("/allCourses/:id", (req, res) => {
  const data = courses.find((c) => c.id === parseInt(req.params.id));
  if (!data) {
    return res.status(404).send("Course is not listed");
  }
  res.status(200).send(data);
});

// update course
app.put("/allCourses/:id", (req, res) => {
  const data = courses.find((c) => c.id === parseInt(req.params.id));
  if (!data) {
    return res.status(404).send("Course is not listed");
  }
  const { name, price } = req.body;
  data.name = name;
  data.price = price;
  res.status(200).send(data);
});

// delete course
app.delete("/allCourses/:id", (req, res) => {
  const data = courses.findIndex((c) => c.id === parseInt(req.params.id));
  if (data === -1) {
    return res.status(404).send("Course is not listed");
  }
  courses.splice(data, 1);
  return res.status(200).send("Course deleted");
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
