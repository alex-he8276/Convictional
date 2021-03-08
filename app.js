const fetch = require("node-fetch");
const express = require('express');
const app = express();
const port = 3000;

const apiUrl = `https://my-json-server.typicode.com/convictional/engineering-interview/products`;
let productData;

app.listen(port, () => {
  fetch(apiUrl)
    .then(res => res.json())
    .then(result => {
      productData = result;
    })
  console.log(`Example app listening at http://localhost:${port}`);
})

// Returns an array of inventory objects for each variant
app.get('/store/inventory', (req, res) => {
  let inventory = [];
  productData.forEach((product) => {
    product.variants.forEach((variant) => {
      inventory.push({
        "productId": product.id,
        "variantId": variant.id,
        "stock": 10
      });
    })
  })
  res.status(200);
  res.send(inventory);
});

// Returns all products
app.get('/product', (req, res) => {
  res.send(productData);
});

// Returns a single product
app.get('/product/:productId', (req, res) => {
  const productId = Number(req.params.productId);
  if (!Number.isInteger(productId)) {
    res.status(400);
    res.send("Invalid ID supplied");
  } else {
    productData.forEach((product) => {
      if (product.id == productId) {
        res.status(200);
        res.send(product);
      }
    })
    res.status(404);
    res.send("product not found");
  }
});