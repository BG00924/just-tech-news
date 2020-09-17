//import the sequelize constructor from the library
const Sequelize = require('sequelize')

//allows us to keep our username and password secret
require('dotenv').config()

//create connection to our database, pass in your mysql informatione for username and password
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
})

module.exports = sequelize