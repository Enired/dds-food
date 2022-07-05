const express = require('express');
const router = express.Router();

//Getting Cart Total
getCartTotal = (db, orderId) => {
  const queryParams = [orderId]
  const query =
    `
      SELECT SUM(menu_items.price * order_items.quantity) / 100 as subtotal
      FROM order_items
             JOIN menu_items on menu_items.id = order_items.menu_item
             JOIN orders on orders.id = order_items.order_id
      WHERE orders.id = $1;
    `
  return db.query(query, queryParams)
}

//Getting Order Specific to User
getOrder = (db, customerId) => {
  const queryParams = [customerId];
  const query =
    `
      SELECT *
      FROM orders
             JOIN users ON users.id = orders.customer_ID
    `
}


module.exports = (db) => {
  router.get("/",
    (req, res) => {
      const uid = req.session.uid
      getCartTotal(db, 5).then(result => {
        console.log(result.rows[0].subtotal)
        const cartTotal = result.rows[0].subtotal
        const templateVar = {
          user: req.session,
          cartTotal
        }
        res.render("cart", templateVar);
      })
    });
  return router;
}
