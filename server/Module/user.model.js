const {DataTypes }=require( 'sequelize');
const sequelize = require('../database/Connection.js'); // Assuming you have a Sequelize instance named 'sequelize' defined in a separate file
const User=sequelize.define("User",{
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        profile: {
          type: DataTypes.STRING,
          allowNull: true,
        },
},{
    tableName: 'users',  
});
console.log(User === sequelize.models.User);
module.exports=User;