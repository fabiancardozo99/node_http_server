# Node.js HTTP Task API

A simple HTTP server built with Node.js to practice core backend concepts such as request handling, routing, and JSON processing without using any frameworks.

## What I practiced

- Creating an HTTP server using the native Node.js `http` module.
- Handling different HTTP methods (GET, POST, PATCH, DELETE).
- Manual routing based on URL and method.
- Parsing request bodies using streams.
- Working with JSON data.
- Implementing basic CRUD operations.
- Error handling and status codes.
- Input validation.
- Understanding how backend frameworks work under the hood.

## Features

- Create a task
- Get all tasks
- Get a task by ID
- Update a task (PATCH)
- Delete a task
- In-memory data storage (no database)

## Installation

Clone the repository:

```bash
git clone https://github.com/fabiancardozo99/node_http_server.git
cd node_http_server
```

Install dependencies:

```bash
npm install
```

## Running the server

### Production

```bash
npm start
```

### Development (auto-restart)

```bash
npm run dev
```

The server will start on:

```txt
http://localhost:3000
```

## Testing

The endpoints were tested using Bruno.

## Example requests

### Get all tasks

GET http://localhost:3000/tasks

---

### Create a task

POST http://localhost:3000/tasks

Body:
{
"title": "Task 1"
}

---

### Get a task by ID

GET http://localhost:3000/tasks/1

---

### Update a task

PATCH http://localhost:3000/tasks/1

Body:
{
"title": "Updated task"
}

---

### Delete a task

DELETE http://localhost:3000/tasks/1

## Notes

- Data is stored in memory and will be lost when the server restarts.
- This project does not use any frameworks.
- The goal is to understand how HTTP servers work at a low level before using tools like Express.
