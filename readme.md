# To-Do-List-API

This project includes development of an api for managing the tasks. 
Operations inlcude:
- Add a new task
- Show list of all tasks.
- Show a particular task.
- Change the status of a particular task.
- Delete a task.

Database: The resources are present as json data in tasks.json file.

## Setup Instructions

1. Clone the repository.
2. Install Node.js if it is not.
3. Install dependencies with 'npm install'.
4. Start the server with 'node app.js'.
5. Test the API using testing tools like Postman.

## API Documentation

### Endpoints 

POST `/tasks`

Allows you to create a new task.

The request body needs to be in JSON format and include the following properties:

 - `title` - String - Required
 - `description` - String - Required
 - `status` - String - Optional(Default value - Pending)

GET `/tasks`

Returns the list of all tasks.

GET `/tasks/:taskId`

Retrieve only the task with provided task-id. A unique task-id is associated with each task. See the list of tasks to get task-id.

PUT `/tasks/:taskId`

Allows you to update the status of a task.

The request body needs to be in JSON format and include the following properties:

 - `status` - String - Value should be one from "pending", "completed", "in-progress".

DELETE `/tasks/:taskId`

Allows you to delete the task with provided task-id.