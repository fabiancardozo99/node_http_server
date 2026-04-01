import http from "node:http";

let tasks = [];
let id = 1;

const server = http.createServer((request, response) => {
  request.on("error", (err) => {
    console.error(err);
    response.statusCode = 400;
    response.end();
  });
  response.on("error", (err) => {
    console.error(err);
  });

  const urlParams = request.url.split("/");

  if (request.method === "GET" && request.url === "/tasks") {
    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(tasks));
    return;
  }

  if (request.method === "POST" && request.url === "/tasks") {
    let body = [];

    request
      .on("data", (chunk) => {
        body.push(chunk);
      })
      .on("end", () => {
        try {
          body = Buffer.concat(body).toString();
          const parsedBody = JSON.parse(body);

          if (
            typeof parsedBody.title !== "string" ||
            parsedBody.title.trim() === ""
          ) {
            response.statusCode = 400;
            response.setHeader("Content-Type", "application/json");
            response.end(JSON.stringify({ error: "Invalid title" }));
            return;
          }

          const newTask = {
            id: id++,
            title: parsedBody.title,
          };
          tasks.push(newTask);

          response.statusCode = 201;
          response.setHeader("Content-Type", "application/json");
          response.end(JSON.stringify(newTask));
        } catch (error) {
          response.statusCode = 400;
          response.setHeader("Content-Type", "applicaiton/json");
          response.end(JSON.stringify({ error: "Invalid JSON" }));
        }
      });

    return;
  }

  if (
    request.method === "GET" &&
    urlParams.length === 3 &&
    urlParams[1] === "tasks"
  ) {
    const paramId = Number(urlParams[2]);
    if (isNaN(paramId)) {
      response.statusCode = 400;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ error: "Task id must be a number" }));
      return;
    }

    const taskToReturn = tasks.find((task) => task.id === paramId);

    if (taskToReturn === undefined) {
      response.statusCode = 404;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ error: "Task not found" }));
      return;
    }

    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(taskToReturn));
    return;
  }

  response.statusCode = 404;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify({ error: "Not found" }));
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
