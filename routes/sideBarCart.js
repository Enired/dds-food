const express = require('express');
const router = express.Router();

//Getting Order Specific to User  ===? maybe when user click my order shows all the information on that page
getOrderIdForLoginUser = (db, customerId) => {
  const queryParams = [customerId];
  const query =
    `
      SELECT orders.id as orderId
      FROM orders
             JOIN users
                  ON users.id = orders.customer_ID
      WHERE orders.customer_id = $1
    `;
  return db.query(query, queryParams);
};

// get order items of an order ===？ to get table tr for cartPage
getOrderItemsByOrderId = (db, orderId) => {
  const queryParams = [orderId];
  const query =
    `
      SELECT orders.id,
             menu_items.name,
             menu_items.image_url,
             menu_items.price,
             menu_items.description,
             order_items.quantity
      FROM orders
             JOIN order_items on orders.id = order_items.order_id
             JOIN menu_items on menu_items.id = order_items.menu_item
      WHERE orders.id = $1
    `;
  return db.query(query, queryParams);

};


//Getting Order Specific to User
getOrder = (db, customerId) => {
  const queryParams = [customerId];
  const query =
    `
      SELECT *
      FROM orders
             JOIN users ON users.id = orders.customer_ID
      WHERE orders.customer_Id = $1
    `;

  return db.query(query, queryParams);
};

module.exports = (db) => {
  router.get("/",
    (req, res) => {
      const customerId = req.session.uid;
      let orderId = 0;
      let orderCartInformation = [];
      getOrderIdForLoginUser(db, customerId)
        .then((result) => {
          if (result.rows[0]) {
            orderId = result.rows[0].orderid;
          } else {
            orderId = undefined;
          }
          getOrderItemsByOrderId(db, orderId)
            .then((result) => {
              console.log('inner', result.rows);
              orderCartInformation = result.rows;
              const templateVar = {
                user: req.session,
                orderCartInformation
              };
              res.json(orderCartInformation)
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    });

  return router;
};








