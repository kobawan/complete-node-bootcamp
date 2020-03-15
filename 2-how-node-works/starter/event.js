const EventEmitter = require("events");
const http = require("http");

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

const emitter = new Sales();

emitter.on("newSale", () => {
  console.log("There was a new sale!");
});

emitter.on("newSale", name => {
  console.log("Customer name:", name);
});

emitter.emit("newSale", "Sara");

///////////////////////////////

const server = http.createServer();

server.on("request", (req, res) => {
  console.log("Request received!");
  res.end("Request received!");
});

server.on("request", (req, res) => {
  console.log("Another request!");
});

server.on("close", () => {
  console.log("Server closed!");
});

server.listen(8000, () => {
  console.log("Server listening to port:", 8000);
});
