const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/connection')
const bycrypt = require('bcrypt')

//create our user model
class User extends Model {}

//define table columns and configuration
User.init(
    {
        //table column definitions go here
        // define the id column
        id: {
            // use the special sequelize datatypes object provide what type of data it is
            type: DataTypes.INTEGER,
            // this is the equivbalent of sql's not null option
            allowNull: false,
            // instruct that this is the primary key
            primaryKey: true,
            // turn on autoincrement
            autoIncrement: true
        },
        // define a  username column
        username: {
            type: DataTypes.STRING,
            allowNull: false 
        },
        //define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            //there cannot be any duplicate email values in this table
            unique: true,
            // if allownull is set to false, we can run our data through validators before creating the table data
            validate: {
                isEmail: true
            }
        },
        // define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                //this meand the password must be at least four characters long
                len: [4]
            }
        },
    },
    {
        // table configurations go here (https://sequelize.org/v5/manual/models-definition.html#configuration)
        //enable us to insert the code to hash the user password
        hooks: {
            // set up beforeCreate lifecycle hook functionality
            // beforeCreate(userData) {
            //     return bycrypt.hash(userData.password, 10)
            //         .then(newUserData => {
            //             return newUserData
            //         })
            // }
            //redoing the above as async
            async beforeCreate(newUserData) {
                newUserData.password = await bycrypt.hash(newUserData.password, 10)
                return newUserData
            },
            // set up beforeupdate lifecycle "hook" functionality
            async beforeUpdate(updateUserData) {
                updateUserData.password = await bycrypt.hash(updateUserData.password, 10)
                return updateUserData
            }
        },
        //pass in our imported sequelize connection (the direct connection to our db)
        sequelize,
        // don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,
        // don't pluralizee name of database table
        freezeTableName: true,
        // use underscores instead of camel-casting (i.e. `comment_text` and not `commentText`)
        underscored: true,
        //make it so our model name stays lowercase in the database
        modelName: 'user'
    }
)

module.exports = User;