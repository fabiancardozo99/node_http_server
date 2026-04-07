import http from "node:http";

let tasks = [];
let id = 1;

function sendJson(response, statusCode, data) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(data));
}

// TODO: Add support for sending array of tasks
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
    sendJson(response, 200, tasks);
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
            sendJson(response, 400, { error: "Invalid title" });
            return;
          }

          const newTask = {
            id: id++,
            title: parsedBody.title,
          };
          tasks.push(newTask);

          sendJson(response, 201, newTask);
        } catch (error) {
          sendJson(response, 400, { error: "Invalid JSON" });
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
      sendJson(response, 400, { error: "Task id must be a number" });
      return;
    }

    const taskToReturn = tasks.find((task) => task.id === paramId);

    if (taskToReturn === undefined) {
      sendJson(response, 404, { error: "Task not found" });
      return;
    }

    sendJson(response, 200, taskToReturn);
    return;
  }

  if (
    request.method === "DELETE" &&
    urlParams.length === 3 &&
    urlParams[1] === "tasks"
  ) {
    const paramId = Number(urlParams[2]);
    if (isNaN(paramId)) {
      sendJson(response, 400, { error: "Task id must be a number" });
      return;
    }

    const indexToDelete = tasks.findIndex((task) => task.id === paramId);

    if (indexToDelete === -1) {
      sendJson(response, 404, { error: "Task not found" });
      return;
    }

    tasks.splice(indexToDelete, 1);

    sendJson(response, 200, { info: "Task deleted" });
    return;
  }

  if (
    request.method === "PATCH" &&
    urlParams.length === 3 &&
    urlParams[1] === "tasks"
  ) {
    const paramId = Number(urlParams[2]);

    if (isNaN(paramId)) {
      sendJson(response, 400, { error: "Task id must be a number" });
      return;
    }

    const indexToPatch = tasks.findIndex((task) => task.id === paramId);

    if (indexToPatch === -1) {
      sendJson(response, 404, { error: "Task not found" });
      return;
    }

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
            sendJson(response, 400, { error: "Invalid title" });
            return;
          }

          tasks[indexToPatch].title = parsedBody.title;

          sendJson(response, 200, tasks[indexToPatch]);
        } catch (error) {
          sendJson(response, 400, { error: "Invalid JSON" });
        }
      });

    return;
  }

  sendJson(response, 404, { error: "Not found" });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
