const fetch = require("node-fetch");
const express = require('express');
const { param, validationResult } = require('express-validator');
const app = express();
const port = 3000;

const apiUrl = `https://my-json-server.typicode.com/convictional/engineering-interview/products`;
let productData;
app.use(express.json());

// Read in product data (if there is a second source of product data, append to productData)
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
      inventory.push(inventorySchema(variant));
    })
  })
  res.status(200);
  return res.json(inventory);
});

// Returns all products
// NOTE: The API contract has conflicting information on what this route should do
// Since '/product/:productId' handles the GET request of a single product
// Thus this returns all products.
app.get('/product', (req, res) => {
  let newProductData = [];
  productData.forEach((product) => {
    newProductData.push(productSchema(product));
  })
  res.json(newProductData);
});

// Returns a single product
app.get('/product/:productId',
  param('productId').isInt(),
  (req, res) => {
    // Product Id should be an integer
    if (!validationResult(req).isEmpty()) {
      return res.status(400).send("Invalid ID supplied");
    }
    const productId = Number(req.params.productId);
    productData.forEach((product) => {
      if (product.id == productId) {
        res.status(200);
        return res.send(productSchema(product));
      }
    })
    res.status(404);
    return res.send("product not found");
  });

/* function renameKey(obj, oldKey, newKey) {
  obj[newKey] = obj[oldKey];
  delete obj[oldKey];
} */

// Schema for product
function productSchema(product) {
  let newProduct = {
    'code': product.id,
    'title': product.title,
    'vendor': product.vendor,
    'bodyHtml': product.body_html,
  }
  let variants = [];
  if (product.variants) {
    product.variants.forEach((variant) => {
      variants.push(variantSchema(variant));
    })
  }
  let images = [];
  if (product.images) {
    product.images.forEach((variant) => {
      images.push(imageSchema(variant));
    })
  }
  newProduct = { ...newProduct, variants, images };
  return newProduct;
}

// Schema for variant
function variantSchema(variant) {
  return {
    "id": variant.id,
    "title": variant.title,
    "sku": variant.sku,
    "inventory_quantity": 0,
    "weight": {
      "value": variant.weight,
      "unit": variant.weight_unit,
    },
  }
}

// Schema for image
function imageSchema(variant) {
  return {
    "source": variant.src,
    "variantId": variant.id,
  }
}

// Schema for inventory
function inventorySchema(variant) {
  return {
    "productId": variant.product_id,
    "variantId": variant.id,
    "stock": 0
  }
}