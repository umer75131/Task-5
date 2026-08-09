// Import Express
const express = require("express");
const app = express();
const PORT = 3000;
// Import MongoDB
const mongoose = require("mongoose");

// Middleware
app.use(express.json());
app.use(express.static("public"));

// It will make DB if it doesn't exist
mongoose.connect("mongodb://localhost:27017/taskmanager")
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log("Connection Error",err);
});

// Schema
const taskSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    status: {type: String, default: "Pending"}
});

// create model
const Task = mongoose.model("Task", taskSchema);

// For get all tasks
app.get("/tasks",async(req, res) => {
    try {
   const tasks = await Task.find();
   res.json(tasks);
   } catch (err) {
            res.status(500).json({ error: "Error fetching tasks"});
   }
});

// Database Code
// Get tasks by ID

app.get("/tasks/:id", async (req, res) => {
    try { 
        const task = await Task.findById(req.params.id);
        if (!task) {
        return res.status(404).json({message: "Task not found"});
    }
   res.json(task);
} catch (err) {
    res.status(404).json({ error: "Error fetching task" });
    }
});

// Create new task
app.post("/tasks", async(req, res) => {

    const { title, description, status } = req.body;

    if (!title || !description){
        return res.status(400).json({message: "Title and description are required"});
    }

    const newTask = new Task({ title, description, status });
    await newTask.save()
    res.status(201).json(newTask);
});

// Update the existing task by ID and also use .save() method to save the updated task in the database.
app.put("/tasks/:id", async (req, res) => {
    const { title, description} = req.body;
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({message: "Task not found"});
      }
        if (title !== undefined){
            task.title = req.body.title;
        }
        if (description !== undefined){
            task.description = req.body.description;
        }
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(404).json({ error: "Error updating task" });
    }
});

// Delete the task by ID
app.delete("/tasks/:id", async (req, res) => {
    try{
         const task = await Task.findByIdAndDelete(req.params.id);
         if (!task) {
             return res.status(404).json({message: "Task not found"});
         }
         res.json({message: "Task deleted successfully"});
    } catch (err) {
        res.status(404).json({ error: "Error deleting task" });
    }
});

// Start Server
// const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
});