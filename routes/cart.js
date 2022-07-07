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


//Getting Cart Total
getCartTotal = (db, orderId) => {
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
      // get customer_id
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
              res.render("cart", templateVar);
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    });

  return router;
};

/////////////////////
// PSEUDOCODE JUNK //
/////////////////////

// So I want the adding to cart button to add an order item to a new order
/*

need a new order button?!!!?!?!?!?!?!?!?!?!?!?!?
              when the user goes to the menu page a new order is created

the current order will always be the last one in the database with a matching customer id
each click on an add to cart button will add the item to the order_items db with the current order ID

when the user goed to the cart page the last order that has the same customer_id will be shown
  this is a joined table between orders and order_items on orders.id = order_items.id


total will be calculated based on the order_items table
   OR OR OR
          create a new table selecting quantity * price as item total



          /// Select (menu_items.price * order_items.quantity)/100 as subtotal
from order_items
join menu_items on menu_items.id = order_items.menu_item
join orders on orders.id = order_items.order_id
where orders.id = 1;



/////////////////////// FINDING SUBTOTAL FOR SPECIFIC ORDER
Select SUM(menu_items.price * order_items.quantity)/100 as subtotal
from order_items
join menu_items on menu_items.id = order_items.menu_item
join orders on orders.id = order_items.order_id
where orders.id = 1;


////////// FINDING ITEMS AND QUANTITY CORRESPONDING TO SPECIFIC ORDER

select  orders.id, menu_items.name, order_items.quantity
from orders
join order_items on orders.id = order_items.order_id
join menu_items on menu_items.id = order_items.menu_item
where orders.id = 2;


//////////SELECT A CUSTOMER LAST ORDER
select * from orders where orders.customer_id = 2 order by orders.created_at desc limit 1;

/////////ADDING A NEW ORDER TO THE DATABASE
INSERT INTO orders(customer_id) values (5);


////  GETTING ALL ORDERS IN PROGRESS
select * from orders where orders.completed_at is null;



// Setting Orders completed value
UPDATE orders SET completed_at = now() where orders.id = 2;

//Setting orders accepted value
UPDATE orders SET accepted_at = now() where orders.id = 2;

//
SELECT users.id from users where users.email = 'octane@legends.com'
;





*/


