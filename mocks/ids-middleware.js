"use strict";

const idMappings = { products: "sku", carts: "id" };

module.exports = (req, res, next) => {
  if (req.method === "POST" || req.method === "PUT") {
    if (req.path.includes("/items")) {
      console.log("modifying /items id for json-server");
      req.body.id = req.body[idMappings.carts];
    } else {
      console.log("modifying /products id for json-server");
      req.body.id = req.body[idMappings.products];
    }
  }
  next();
};
