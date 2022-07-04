const express = require('express');
const router = express.Router();


module.exports = (db) => {
  router.get("/",
    (req, res) => {
      res.render("cart");
    });
  return router;
}

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


