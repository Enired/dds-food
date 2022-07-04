const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
router.use(express.urlencoded({extended: true}))

module.exports = (db) => {
  //  login
  router.get('/', (req, res) => {
    //if user already login cannot show login page
    if (req.session['user_id']) {
      res.redirect('/')
    }
    res.render("login")
  })

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
          const templateVars = {
            errMsg
          }
          res.status(400).render('login', templateVars)
          return
        }
        const hashedPassword = result.rows[0].password
        // console.log('hashedPassword ====', hashedPassword)
        // console.log(bcrypt.compareSync(password.trim(), hashedPassword))
        if (!bcrypt.compareSync(password.trim(), hashedPassword)) {
          return res.redirect("?error=Authentication failed - Please try again");
        }
        //  login success
        console.log('login success!')
        const user = result.rows[0]
        // console.log(user)
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


