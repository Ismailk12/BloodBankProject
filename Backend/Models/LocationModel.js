const { DataTypes } = require('sequelize');
const sequelize = require('../Database/Database');

const Location = sequelize.define('Location', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    index: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    district: {
        type: DataTypes.JSON, // Using JSON for SQLite
        allowNull: false
    }
}, {
    tableName: 'Locations',
    timestamps: true
});

module.exports = Location;