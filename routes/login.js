const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
router.use(express.urlencoded({extended: true}))

module.exports = (db) => {
  //  login
  router.post("/", (req, res) => {
    const {email, password} = req.body;
    if (!email) {
      res.send('You have to enter your email!')
    }
    return db.query(`
      SELECT *
      FROM users
      WHERE email = $1
    `, [email.trim()])
      .then(result => {
        if (!result.rows[0]) {
          const errMsg = 'Authentication failed!'
          res.status(400).redirect(`/user/login/${errMsg}`)
          return
        }
        const hashedPassword = result.rows[0].password
        // console.log('hashedPassword ====', hashedPassword)
        // console.log(bcrypt.compareSync(password.trim(), hashedPassword))
        if (!bcrypt.compareSync(password.trim(), hashedPassword)) {
          return res.redirect("?error=Authentication failed - Please try again");
        }
        //  login success
        // console.log('success!')
        const user = result.rows[0]
        req.session["user_id"] = result.rows[0].id
        req.session["email"] = result.rows[0].email
        req.session["first_name"] = result.rows[0]['first_name']
        req.session["last_name"] = result.rows[0]['last_name']
        req.session["phone_number"] = result.rows[0]['phone_number']
        res.redirect('/')
      })
      .catch(err => console.error(err))
  })
  return router;
};


