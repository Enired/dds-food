const express = require('express');
const router = express.Router();

module.exports = (db) => {

  const getCartItems = function(db, res, req) {

    // Check right away if cart is empty, and don't even go any further if it is
    if (req.cookies.cart === '') {
      res.render('cart', { user: req.session, cartItems: [] });
      return;
    }

    // Parsing cart cookie to use in menu_items query
    const itemsAndQuantity = {};
    const placeholders = [];
    let cart = req.cookies.cart;
    cart = cart.split(',');

    // Populating itemsAndQuantity and the placeholders to use in query below
    for (let i = 0; i < cart.length; i++) {
      cart[i] = cart[i].split('x');
      itemsAndQuantity[cart[i][1]] = cart[i][0];
      placeholders.push('$' + (i + 1));
    }

    db.query(`
    SELECT id, name, price, image_url
    FROM menu_items
    WHERE id IN (${placeholders.join(', ')});
    `, Object.keys(itemsAndQuantity))
      .then((data) => {
        // Attaching quantities to each returned queried item to use in cart.ejs
        for (const item of data.rows) {
          item.quantity = itemsAndQuantity[item.id];
        }
        res.render('cart', { user: req.session, cartItems: data.rows });
      });

  };

  router.get('/', (req, res) => {
    getCartItems(db, res, req);
  });

  return router;
};
