const express = require('express');
const router = express.Router();

module.exports = (db) => {

  const getCartItems = function(db, res, req) {

    // Check right away if cart is empty, and don't even go any further if it is
    if (req.cookies.cart === '' || req.cookies.cart === undefined) {
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



  //Submit Order

  const submitOrder = (db, customerId) => {
    const params = [customerId];
    const query =
    `
    INSERT INTO orders(customer_id, created_at)
    VALUES($1, now())
    RETURNING id as new_order
    `;
    return db.query(query, params);
  };
  const submitOrderItems = (db, orderId, quantity, menuItem) =>{
    const params = [orderId, quantity, menuItem];
    const query =
    `
    INSERT INTO order_items(order_id, quantity, menu_item)
    VALUES ($1, $2, $3)
    `;
    return db.query(query, params);
  };


  router.post('/submit-order-now', (req, res) => {
    const itemsAndQuantity = {};
    const placeholders = [];
    let cart = req.cookies.cart;
    cart = cart.split(',');
    const userId = req.session.uid;
    Promise.resolve(submitOrder(db, userId))
      .then((results)=>{
        const newOrderId = results.rows[0].new_order;
        return newOrderId;
      })
      .then((newOrderId)=>{
        const promises = [];
        for (item of cart) {
          const something = item.split('x');
          const quantity = something[0];
          const menu_item = something[1];
          promises.push(submitOrderItems(db, newOrderId, quantity, menu_item));
        }
        return promises;
      })
      .then((promises)=>{
        Promise.all(promises); //This is going through the list of items and adding it to that table. But no longer has access to customer info. no it's lost.
      })
      .then(()=>{
      /// TEXT THE RESTAURANT HERE.

      ///Maybe query the details of the order here relevant to text? I don't know.
      })
      .then(()=>{
        res.redirect('/orders');
      });



  });

  return router;
};
