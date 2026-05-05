# React MongoDB CRUD Relationship Assignment

This project demonstrates a simple React CRUD app connected to MongoDB. It is made for easy explanation in class and works with MongoDB Compass.

## Relationships shown

- One-to-many: one `Department` has many `Student` records.
- Many-to-many: many `Student` records connect to many `Course` records through the `Enrollment` collection.

## Database used in MongoDB Compass

Use this connection in MongoDB Compass:

```text
mongodb://127.0.0.1:27017
```

The app creates this database:

```text
college_crud_demo
```

Collections:

- `departments`
- `students`
- `courses`
- `enrollments`

## How to run with Docker Compose

This is the containerized setup for phase two. It runs three containers:

- `a27-client`: React app served by Nginx.
- `a27-server`: Express API.
- `a27-mongo`: MongoDB database.

Start all containers:

```bash
docker compose up --build -d
```

Seed sample data inside the backend container:

```bash
docker compose exec server npm run seed
```

Open the app:

```text
http://localhost:5173
```

Open MongoDB Compass:

```text
mongodb://127.0.0.1:27017
```

Then choose the `college_crud_demo` database.

Stop all containers:

```bash
docker compose down
```

## Jenkins pipeline phase

The project includes a Jenkins pipeline in `Jenkinsfile`.

Pipeline stages:

- Check project files.
- Validate `docker-compose.yml`.
- Build React and Express Docker images.
- Start the multi-container app.
- Seed MongoDB.
- Smoke test the frontend and API.

For the GitHub-backed Jenkins job, Jenkins reads this repository from:

```text
https://github.com/ShashwatUpadhayaya/A27.git
```

Jenkins still needs the Docker socket mounted so the pipeline can run Docker Compose.

The prepared Jenkins job config is here:

```text
jenkins/a27-pipeline-config.xml
```

After Jenkins is ready, the job name is:

```text
A27-Pipeline
```

The Docker-enabled Jenkins image is built from:

```text
jenkins/Dockerfile
```

Verified Jenkins result:

```text
A27-Pipeline #2: SUCCESS
```

If Jenkins shows `No Changes`, the job is probably using an inline/local pipeline script instead of `Pipeline script from SCM`. Configure it to read `Jenkinsfile` from the GitHub repository above.

## How to run without Docker

1. Start MongoDB from your local MongoDB service or from any MongoDB container that exposes this port:

```text
27017:27017
```

2. Copy the backend environment file:

```bash
copy server\.env.example server\.env
```

3. Install dependencies:

```bash
npm run install:all
```

4. Add sample data:

```bash
npm run seed
```

5. Run React and Express together:

```bash
npm run dev
```

Open the React app:

```text
http://localhost:5173
```

Backend API:

```text
http://localhost:5000
```

If seeding shows `ECONNREFUSED 127.0.0.1:27017`, MongoDB is not reachable yet. Start MongoDB first, then run `npm run seed` again.

## Easy explanation

This app is a college manager.

Department and Student show one-to-many because one department can have many students, but each student belongs to one department.

Student and Course show many-to-many because one student can take many courses, and one course can have many students. The `enrollments` collection stores this connection using `student` and `course` ids.

## CRUD features

- Create, read, update, and delete departments.
- Create, read, update, and delete students.
- Create, read, update, and delete courses.
- Create and delete enrollments.

Deleting a student or course also deletes related enrollments so the many-to-many collection stays clean.
