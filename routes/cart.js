const express = require('express');
const router = express.Router();


module.exports = (db) => {
  router.get("/",
    (req, res) => {
      // console.log('cart====',req.session)
      const templateVar = {
        user: req.session
      }
      res.render("cart",templateVar);
    });
  return router;
}
