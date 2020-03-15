const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const { replaceTemplate } = require("./utils/replaceTemplate");

const data = fs.readFileSync(path.resolve("./dev-data/data.json"), "utf-8");
const parsedData = JSON.parse(data);

const tempOverview = fs.readFileSync(path.resolve("./templates/template-overview.html"), "utf-8");
const tempCard = fs.readFileSync(path.resolve("./templates/template-card.html"), "utf-8");
const tempProduct = fs.readFileSync(path.resolve("./templates/template-product.html"), "utf-8");

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  switch (pathname) {
    case "/":
    case "/overview":
      res.writeHead(200, {
        "Content-type": "text/html"
      });

      const cardsHtml = parsedData.map(item => replaceTemplate(tempCard, item)).join("");
      const overviewHtml = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

      res.end(overviewHtml);
      break;
    case "/product":
      res.writeHead(200, {
        "Content-type": "text/html"
      });

      const product = parsedData[query.id];
      const productHtml = replaceTemplate(tempProduct, product);

      res.end(productHtml);
      break;
    case "/api":
      res.writeHead(200, {
        "Content-type": "application/json"
      });
      res.end(parsedData);
      break;
    default:
      res.writeHead(404, {
        "Content-type": "text/html"
      });
      res.end("<h1>Page not found!</h1>");
      break;
  }
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log("Listening to port:", PORT);
});
