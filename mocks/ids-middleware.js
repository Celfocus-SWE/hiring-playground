'use strict'

module.exports = (req, res, next) => {
    console.log(`[Middleware] ${req.method} ${req.path}`, req.body);
    
    // Handle cart items operations
    if (req.path.includes('/carts/items')) {
        if (req.method === 'GET') {
            // For GET requests, we need to return the cart items from the nested structure
            // This will be handled by a custom route
            console.log('GET request for cart items');
        }
        else if (req.method === 'POST') {
            // For POST requests, ensure the item has both id and itemId
            if (req.body.itemId) {
                req.body.id = req.body.itemId;
                console.log('POST: Set id to itemId:', req.body.id);
            }
        }
        else if (req.method === 'PUT') {
            // For PUT requests, ensure the item has both id and itemId
            if (req.body.itemId) {
                req.body.id = req.body.itemId;
                console.log('PUT: Set id to itemId:', req.body.id);
            }
        }
        else if (req.method === 'DELETE') {
            console.log('DELETE request for cart item with ID:', req.params.id);
        }
    }
    
    // Handle products operations
    if (req.path.includes('/products')) {
        if (req.method === 'POST' || req.method === 'PUT') {
            if (req.body.sku) {
                req.body.id = req.body.sku;
                console.log('Set product id to sku:', req.body.id);
            }
        }
    }
    
    next()
}