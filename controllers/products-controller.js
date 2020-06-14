const express = require("express");
const productsLogic = require("../bll/products-logic");

const router = express.Router();

// GET http://localhost:3000/api/products
router.get("/", async (request, response) => {
    try {
        const products = await productsLogic.getAllProducts();
        response.json(products);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// GET http://localhost:3000/api/products/5db14c4cc4f40a2e4914d2bc
router.get("/:_id", async (request, response) => {
    try {
        const _id = request.params._id;
        const product = await productsLogic.getOneProduct(_id);
        response.json(product);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// POST http://localhost:3000/api/products
router.post("/", async (request, response) => {
    try {
        const product = request.body;
        const addedProduct = await productsLogic.addProduct(product);
        response.status(201).json(addedProduct);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// PUT http://localhost:3000/api/products/5db14c4cc4f40a2e4914d2bc
router.put("/:_id", async (request, response) => {
    try {
        const _id = request.params._id;
        const product = request.body;
        product._id = _id;
        const updatedProduct = await productsLogic.updateProduct(product);
        response.json(updatedProduct);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// PATCH http://localhost:3000/api/products/5db14c4cc4f40a2e4914d2bc
router.patch("/:_id", async (request, response) => {
    try {
        const _id = request.params._id;
        const product = request.body;
        product._id = _id;
        const updatedProduct = await productsLogic.updateProduct(product);
        response.json(updatedProduct);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

// DELETE http://localhost:3000/api/products/5db14c4cc4f40a2e4914d2bc
router.delete("/:_id", async (request, response) => {
    try {
        const _id = request.params._id;
        await productsLogic.deleteProduct(_id);
        response.sendStatus(204);
    }
    catch (err) {
        response.status(500).send(err.message);
    }
});

module.exports = router;