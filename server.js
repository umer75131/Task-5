// Import Express
const express = require("express");
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// In-memory array
let tasks = [
    {
        id: 1,
        title: "Complete Assignment",
        description: "Finish Express CRUD Project",
        status: "Pending"
    }
];

let nextId = 2;

/*
==========================================
GET /
Welcome Message
==========================================
*/
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

/*
==========================================
GET /tasks
Return all tasks
==========================================
*/
app.get("/tasks", (req, res) => {
    res.json(tasks);
});

/*
==========================================
GET /tasks/:id
Return one task by ID
404 if task not found
==========================================
*/
app.get("/tasks/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    res.json(task);
});

/*
==========================================
POST /tasks
Create new task
==========================================
*/
app.post("/tasks", (req, res) => {

    const { title, description, status } = req.body;

    const newTask = {
        id: nextId++,
        title,
        description,
        status
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
});

/*
==========================================
PUT /tasks/:id
Update existing task
404 if not found
==========================================
*/
app.put("/tasks/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    task.title = req.body.title;
    task.description = req.body.description;
    task.status = req.body.status;

    res.json(task);

});

/*
==========================================
DELETE /tasks/:id
Delete task
404 if task not found
==========================================
*/
app.delete("/tasks/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {

        return res.status(404).json({
            message: "Task not found"
        });

    }

    tasks.splice(index, 1);

    res.json({
        message: "Task deleted successfully"
    });

});

// Start Server
app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
});