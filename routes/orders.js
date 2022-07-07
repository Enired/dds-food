const e = require('express');
const express = require('express');
const router = express.Router();


//Getting Order Total
getOrderTotal = (db, orderId) => {
  const queryParams = [orderId];
  const query =
  `
  SELECT SUM(menu_items.price * order_items.quantity)/100 as subtotal
  FROM order_items
  JOIN menu_items on menu_items.id = order_items.menu_item
  JOIN orders on orders.id = order_items.order_id
  WHERE orders.id = $1;
  `;
  return db.query(query, queryParams);
};

//Getting Order Specific to User
getOrder = (db, customerId) => {
  const queryParams = [customerId];
  const query =
  `
  SELECT orders.id
  FROM orders
  JOIN users ON users.id = orders.customer_ID
  WHERE orders.customer_Id = $1
  `;
  return db.query(query, queryParams);

};

//Getting all open orders
getOpenOrders = (db) => {
  const query =
  `
  SELECT orders.id
  FROM orders
  JOIN users ON users.id = orders.customer_ID
  WHERE orders.completed_at IS null
  `;
  return db.query(query);

};


//Getting Oder Items of An Order
getOrderDetails = (db, orderId) => {
  const queryParams = [orderId];
  const query =
  `
  SELECT  orders.id as order_Id,
          orders.created_at,
          menu_items.name,
          orders.completed_at,
          order_items.quantity,
          menu_items.image_url,
          users.first_name,
          users.last_name,
          users.email,
          users.phone_number,
	            (SELECT SUM(menu_items.price * order_items.quantity)/100 as order_total
              FROM order_items
              JOIN menu_items on menu_items.id = order_items.menu_item
              JOIN orders on orders.id = order_items.order_id
              WHERE orders.id = $1)
  FROM orders
  JOIN order_items on orders.id = order_items.order_id
  JOIN menu_items on menu_items.id = order_items.menu_item
  JOIN users on users.id = orders.customer_id
  WHERE orders.id = $1;
  `;
  return db.query(query, queryParams);
};

markOrderAsCompleted = (db, orderId) => {
  params = [orderId];
  const query =
  `
   UPDATE orders
   SET completed_at = now()
   WHERE orders.id =$1
  `;

  return db.query(query,params);
};

module.exports = (db) => {
  router.get("/",
    (req, res) => {

      let p1;
      let pageToRender;

      const customerId = req.session.uid;
      const is_owner = req.session.is_owner;
      if (is_owner) {
        p1 = getOpenOrders(db);
        pageToRender = "owners";
      } else {
        p1 = getOrder(db, customerId);
        pageToRender = "orders";
      }

      Promise.resolve(p1)
        .then(results => {
          orderIds = results.rows; return orderIds;
        })
        .then(results=>{
          findingOrderItems = [];
          for (value of results) {
            id = value.id;
            findingOrderItems.push(getOrderDetails(db,id));
          }
          return findingOrderItems;
        })
        .then(results => {
          Promise.all(results).then(values => {
            orderIds = [];
            orderItems = [];
            for (value of values) {
              for (row of value.rows) {
                if (!orderIds.includes(row.order_id)) {
                  orderIds.push(row.order_id);
                }
              }
              orderItems.push(value.rows);
            }
            const templateVars = {orderIds,orderItems};
            return templateVars;
          })
            .then((templateVars)=>{
              res.render(pageToRender, {templateVars, user: req.session});
            });
        });
    });


  router.post("/order-complete", (req,res)=>{
    orderId = req.body.hello;
    console.log(orderId);
    Promise.resolve(markOrderAsCompleted(db,orderId)).then(res.redirect('/orders'));
  });

  //Backup in case the jquery doesn't work properly.
  router.post("/sendSMS",(req,res)=>{
    const time = Number(req.body.orderETA);
    const etaMsg = `About ${time} minutes  until your order is ready`;
    console.log(etaMsg);

    res.redirect('/orders');

  });
  return router;
};


