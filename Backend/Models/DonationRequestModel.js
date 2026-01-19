const { DataTypes } = require('sequelize');
const sequelize = require('../Database/Database');

const DonationRequest = sequelize.define('DonationRequest', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Gender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    DateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false
    },
    MobileNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    TentativeDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    State: {
        type: DataTypes.STRING,
        allowNull: false
    },
    District: {
        type: DataTypes.STRING,
        allowNull: false
    },
    BloodBankName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    BloodGroup: {
        type: DataTypes.STRING,
        allowNull: true
    },
    GoIID: {
        type: DataTypes.STRING,
        allowNull: true
    },
    GoIIDNumber: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'DonationRequests',
    timestamps: true
});

module.exports = DonationRequest;