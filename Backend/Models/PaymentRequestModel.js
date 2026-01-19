const { DataTypes } = require('sequelize');
const sequelize = require('../Database/Database');

const PaymentRequest = sequelize.define('PaymentRequest', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    EMAIL: {
        type: DataTypes.STRING,
        allowNull: true
    },
    MOBILE_NO: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ORDERID: {
        type: DataTypes.STRING,
        allowNull: true
    },
    TXNAMOUNT: {
        type: DataTypes.STRING,
        allowNull: true
    },
    RECIEVER_RREQUEST_ID: {
        type: DataTypes.STRING,
        allowNull: true
    },
    RECIEVER_EMAIL: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'PaymentRequests',
    timestamps: true
});

module.exports = PaymentRequest;