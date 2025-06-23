const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("apis-mock.json");
const middlewares = jsonServer.defaults();

const cartMiddleware = (req, res, next) => {
  if (req.path.includes("/api/v1/carts/items")) {
    const db = router.db;

    if (req.method === "GET") {
      const cartItems = db.get("carts.items").value();
      res.jsonp(cartItems);
      return;
    }

    if (req.method === "POST") {
      const cartItems = db.get("carts.items").value();
      const existingItem = cartItems.find(
        (item) => item.itemId === req.body.itemId
      );

      if (existingItem) {
        existingItem.quantity += req.body.quantity || 1;
        if (req.body.imageUrl) {
          existingItem.imageUrl = req.body.imageUrl;
        }
        db.get("carts.items")
          .find({ itemId: req.body.itemId })
          .assign(existingItem)
          .write();
        res.jsonp(existingItem);
      } else {
        const newItem = {
          id: req.body.itemId,
          itemId: req.body.itemId,
          quantity: req.body.quantity || 1,
          price: req.body.price,
          name: req.body.name,
          imageUrl: req.body.imageUrl,
        };
        db.get("carts.items").push(newItem).write();
        res.jsonp(newItem);
      }
      return;
    }

    if (req.method === "PUT") {
      const itemId = req.path.split("/").pop();
      if (!itemId) {
        res.status(400).jsonp({ error: "Item ID is required" });
        return;
      }

      const existingItem = db.get("carts.items").find({ itemId }).value();
      if (!existingItem) {
        res.status(404).jsonp({ error: "Item not found" });
        return;
      }

      const updatedItem = {
        id: itemId,
        itemId: itemId,
        quantity: req.body.quantity || existingItem.quantity,
        price: req.body.price || existingItem.price,
        name: req.body.name || existingItem.name,
        imageUrl: req.body.imageUrl || existingItem.imageUrl,
      };

      db.get("carts.items").find({ itemId }).assign(updatedItem).write();
      res.jsonp(updatedItem);
      return;
    }

    if (req.method === "DELETE") {
      const itemId = req.path.split("/").pop();
      if (!itemId) {
        res.status(400).jsonp({ error: "Item ID is required" });
        return;
      }

      const existingItem = db.get("carts.items").find({ itemId }).value();
      if (!existingItem) {
        res.status(404).jsonp({ error: "Item not found" });
        return;
      }

      db.get("carts.items").remove({ itemId }).write();
      res.jsonp({ message: "Item deleted successfully" });
      return;
    }
  }

  next();
};

// Remove express.json() – json-server already handles JSON parsing
server.use(middlewares);
server.use(jsonServer.bodyParser); // <== this is the built-in body parser

server.use(cartMiddleware);
server.use(router);

const port = 8082;
server.listen(port, "0.0.0.0", () => {
  console.log(`JSON Server is running on port ${port}`);
  console.log(`Cart endpoints:`);
  console.log(`  GET    http://localhost:${port}/api/v1/carts/items`);
  console.log(`  POST   http://localhost:${port}/api/v1/carts/items`);
  console.log(`  PUT    http://localhost:${port}/api/v1/carts/items/:id`);
  console.log(`  DELETE http://localhost:${port}/api/v1/carts/items/:id`);
}); 