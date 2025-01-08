let express = require('express');
let cors = require('cors');
const { resolve } = require('path');

let app = express();
app.use(cors());
const port = 3000;

// Server-side values
let taxRate = 5; // 5%
let discountPercentage = 10; //10%
let loyaltyRate = 2; // 2points per 1$

// Calculate the total price of items in the cart
function totalPriceOfItems(newItemPrice, cartTotal) {
  let totalPrice = newItemPrice + cartTotal;
  return totalPrice.toString();
}

app.get('/cart-total', (req, res) => {
  let newItemPrice = parseFloat(req.query.newItemPrice);
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send(totalPriceOfItems(newItemPrice, cartTotal));
});

// Apply discount based on membership status
function calculateMemberPrice(cartTotal, isMember) {
  let member = isMember == 'true';
  let finalPrice = cartTotal;
  if (member) {
    finalPrice = finalPrice - (finalPrice * discountPercentage) / 100;
  }
  return finalPrice.toString();
}
app.get('/membership-discount', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  let isMember = parseFloat(req.query.isMember);
  res.send(calculateMemberPrice(cartTotal, isMember));
});

// Calculate tax on the cart total
function calculateTax(cartTotal) {
  let tax = (cartTotal * taxRate) / 100;
  return tax.toString();
}
app.get('/calculate-tax', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send(calculateTax(cartTotal));
});

// Estimate delivery time based on shipping method
function estimateDeliveryTime(shippingMethod, distance) {
  let express = shippingMethod === 'express';
  let days;
  if (express) {
    days = distance / 100;
  } else {
    days = distance / 50;
  }
  return days.toString();
}
app.get('/estimated-delivery', (req, res) => {
  let shippingMethod = req.query.shippingMethod;
  let distance = parseFloat(req.query.distance);
  res.send(estimateDeliveryTime(shippingMethod, distance));
});

// Calculate the shipping cost based on weight and distance
function calculateShippingCost(weight, distance) {
  let shippingCost = weight * distance * 0.1;
  return shippingCost.toString();
}
app.get('/shipping-cost', (req, res) => {
  let weight = parseFloat(req.query.weight);
  let distance = parseFloat(req.query.distance);
  res.send(calculateShippingCost(weight, distance));
});

//Calculate the loyalty points
function calculateLoyaltyPoints(purchaseAmount) {
  let loyaltyPoints = purchaseAmount * 2;
  return loyaltyPoints.toString();
}
app.get('/loyalty-points', (req, res) => {
  let purchaseAmount = req.query.purchaseAmount;
  res.send(calculateLoyaltyPoints(purchaseAmount));
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
