const { DataTypes } = require('sequelize');
const sequelize = require('../Database/Database');

const Fundraising = sequelize.define('Fundraising', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    UserID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Heading: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    RecievedFunds: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    Description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    Image: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Fundraising',
    timestamps: true
});

module.exports = Fundraising;