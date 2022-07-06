const express = require('express');
const router = express.Router();
router.use(express.urlencoded({extended: true}))

module.exports = (db) => {
  router.post("/", (req, res) => {
    console.log('orderRoutes',req.cookies['cart'])
    // console.log(req.body)
  });

  return router;
};
