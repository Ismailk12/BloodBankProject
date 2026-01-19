const { DataTypes } = require('sequelize');
const sequelize = require('../Database/Database');

const DonationCamp = sequelize.define('DonationCamp', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    CampName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ConductedBy: {
        type: DataTypes.STRING,
        allowNull: false
    },
    OrganizedBy: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    State: {
        type: DataTypes.STRING,
        allowNull: false
    },
    District: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Register: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Contact: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Address: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'DonationCamps',
    timestamps: true
});

module.exports = DonationCamp;