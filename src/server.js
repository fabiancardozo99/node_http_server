import http from "node:http";

let tasks = [];

const server = http.createServer((request, response) => {
  request.on("error", (err) => {
    console.error(err);
    response.statusCode = 400;
    response.end();
  });
  response.on("error", (err) => {
    console.error(err);
  });

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
          const parseBody = JSON.parse(body);

          const newTask = {
            title: parseBody.title,
          };
          tasks.push(newTask);

          response.statusCode = 201;
          response.setHeader("Content-Type", "application/json");
          response.end(JSON.stringify(newTask));
        } catch (error) {
          response.statusCode = 400;
          response.end("Invalid JSON");
        }
      });

    return;
  }

  response.statusCode = 400;
  response.end("Not found");
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
