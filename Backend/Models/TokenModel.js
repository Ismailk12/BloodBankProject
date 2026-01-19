const { DataTypes } = require('sequelize');
const sequelize = require('../Database/Database');

const Token = sequelize.define('Token', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiresAt: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Tokens',
    timestamps: false // Mongoose model had custom timestamps
});

module.exports = Token;