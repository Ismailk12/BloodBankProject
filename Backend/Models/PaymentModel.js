const { DataTypes } = require('sequelize');
const sequelize = require('../Database/Database');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    EMAIL: {
        type: DataTypes.STRING,
        allowNull: false
    },
    MOBILE_NO: {
        type: DataTypes.STRING,
        allowNull: false
    },
    RECIEVER_RREQUEST_ID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    RECIEVER_EMAIL: {
        type: DataTypes.STRING,
        allowNull: false
    },
    TXNID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    BANKTXNID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ORDERID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    TXNAMOUNT: {
        type: DataTypes.STRING,
        allowNull: false
    },
    STATUS: {
        type: DataTypes.STRING,
        allowNull: false
    },
    TXNTYPE: {
        type: DataTypes.STRING,
        allowNull: false
    },
    GATEWAYNAME: {
        type: DataTypes.STRING,
        allowNull: false
    },
    RESPCODE: {
        type: DataTypes.STRING,
        allowNull: false
    },
    RESPMSG: {
        type: DataTypes.STRING,
        allowNull: false
    },
    BANKNAME: {
        type: DataTypes.STRING,
        allowNull: false
    },
    MID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    PAYMENTMODE: {
        type: DataTypes.STRING,
        allowNull: false
    },
    REFUNDAMT: {
        type: DataTypes.STRING,
        allowNull: false
    },
    TXNDATE: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Payments',
    timestamps: true
});

module.exports = Payment;