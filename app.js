const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs
const fs = require('fs'); // For read or write on tasks.json
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Path to tasks.json file
const tasksFilePath = path.join(__dirname, 'tasks.json');

// Utility function to read tasks from tasks.json
const readTasksFromFile = () => {
    if (!fs.existsSync(tasksFilePath)) {
        fs.writeFileSync(tasksFilePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(tasksFilePath);
    return JSON.parse(data);
};

// Utility function to write tasks to tasks.json
const writeTasksToFile = (tasks) => {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
};

// POST /tasks - Create a new task
app.post('/tasks', (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required.' });
    }

    const tasks = readTasksFromFile();

    const newTask = {
        id: uuidv4(),
        title,
        description,
        status: 'pending', // Default status
    };

    tasks.push(newTask);
    writeTasksToFile(tasks);
    res.status(201).json(newTask);
});

// GET /tasks - Fetch all tasks
app.get('/tasks', (req, res) => {
    const tasks = readTasksFromFile();
    res.json(tasks);
});

// GET /tasks/:id - Fetch a task by ID
app.get('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const tasks = readTasksFromFile();
    const task = tasks.find((t) => t.id === id);

    if (!task) {
        return res.status(404).json({ message: 'Task not found.' });
    }

    res.json(task);
});

// PUT /tasks/:id - Update the task status
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Checking status values
    if (!['pending', 'in-progress', 'completed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Allowed values: pending, in-progress, completed.' });
    }

    const tasks = readTasksFromFile();
    const task = tasks.find((t) => t.id === id);

    if (!task) {
        return res.status(404).json({ message: 'Task not found.' });
    }

    task.status = status;
    writeTasksToFile(tasks);
    res.json(task);
});

// DELETE /tasks/:id - Delete a task by ID
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const tasks = readTasksFromFile();
    const taskIndex = tasks.findIndex((t) => t.id === id);

    // If task with particular ID is not present
    if (taskIndex === -1) { 
        return res.status(404).json({ message: 'Task not found.' });
    }

    tasks.splice(taskIndex, 1);
    writeTasksToFile(tasks);
    res.status(204).send(); // No content
});

// Running the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
