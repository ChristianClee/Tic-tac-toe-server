const Pool = require('pg').Pool

// const pool = new Pool({
//   user: process.env.USER_DB,
//   password: process.env.PASSWORD_DB,
//   host: process.env.HOST_DB,
//   port: process.env.PORT_DB,
//   database: process.env.DATABASE_DB,
// })
const pool = new Pool({
  user: "postgres",
  password: "root",
  host: "db",
  port: 5432,
  database: "tic-tac-toe",
})

module.exports = pool