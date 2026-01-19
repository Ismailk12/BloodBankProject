const { DataTypes } = require('sequelize');
const sequelize = require('../Database/Database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    FirstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    LastName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    DateOfBirth: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Gender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    State: {
        type: DataTypes.STRING,
        allowNull: false
    },
    District: {
        type: DataTypes.STRING,
        allowNull: false
    },
    PinCode: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    MobileNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    UserType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    Avatar: {
        type: DataTypes.STRING,
        defaultValue: "https://www.w3schools.com/howto/img_avatar.png"
    },
    Background: {
        type: DataTypes.STRING,
        defaultValue: "https://www.w3schools.com/w3css/img_lights.jpg"
    },
    Verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    BankAccountNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    IFSC: {
        type: DataTypes.STRING,
        allowNull: true
    },
    UPI: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'Users',
    timestamps: true
});

module.exports = User;