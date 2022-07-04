const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
router.use(express.urlencoded({extended: true}))

module.exports = (db) => {
  //  register
  router.post("/", (req, res) => {
    console.log('register~~~~~~')
    const {email, firstName, lastName, password, phoneNumber} = req.body;

    //hash password 10 is salt
    const hashPassword = bcrypt.hashSync(password, 10)
    if (!email) {
      const errMsg = 'You have to enter your email!'
      res.status(400).send(errMsg)
    }

    return db.query(`
      SELECT *
      FROM users
      WHERE email = $1
    `, [email.trim()])

      .then(result => {
        if (result.rows.length !== 0) {
          const errMsg = 'Email already exists!'
          return res.status(400).send(errMsg)
        }
        return db.query(`
          INSERT INTO users(first_name, last_name, password, email, phone_number)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `, [firstName, lastName, hashPassword, email, phoneNumber])
          .then((result) => {
            const newUser = result.rows[0]
            console.log('NewUser=================', newUser)
            req.session["user_id"] = result.rows[0].id
            req.session["email"] = result.rows[0].email
            req.session["first_name"] = result.rows[0]['first_name']
            req.session["last_name"] = result.rows[0]['last_name']
            req.session["phone_number"] = result.rows[0]['phone_number']
            res.redirect('/')
          })
          .catch()
      })

  })

  return router;
};


