import http from "http";

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(
    JSON.stringify({
      success: true,
      message: "Railway Alive",
    }),
  );
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on ${PORT}`);
});
