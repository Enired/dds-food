// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
// cookie-session
const cookieSession = require("cookie-session");
const express = require("express");
const app = express();
const morgan = require("morgan");

// PG database client/connection setup
const {Pool} = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect(() => {
  console.log('dds_food database connected!!!!')
});
// check cookie-session works
app.use(
  cookieSession({
    name: "dds_food",
    keys: ["hello", "world"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");
const cartRoutes = require("./routes/cart");
const loginRoutes = require("./routes/login")
const registerRoutes = require("./routes/register")
const logoutRoutes = require('./routes/logout')

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/login", loginRoutes(db))
app.use("/register", registerRoutes(db))
app.use("/logout", logoutRoutes(db))
app.use("/users", usersRoutes(db));
app.use("/cart", cartRoutes(db))
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  // console.log('=====', req.session)
  res.render("index");
});

app.listen(PORT, () => {
  console.log(`DDS_Food app listening on port ${PORT}`);
});
