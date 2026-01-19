const { DataTypes } = require('sequelize');
const sequelize = require('../Database/Database');

const BloodBank = sequelize.define('BloodBank', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    State: {
        type: DataTypes.STRING,
        allowNull: false
    },
    District: {
        type: DataTypes.STRING,
        allowNull: false
    },
    City: {
        type: DataTypes.STRING,
        allowNull: true
    },
    BloodBank: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ParentHospital: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ShortName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ContactPerson: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Phone: {
        type: DataTypes.STRING, // Using String for phone to accommodate varied formats
        allowNull: false
    },
    FAX: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Licence: {
        type: DataTypes.STRING,
        allowNull: true
    },
    FromDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    ToDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    ComponentFacility: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ApheresisFacility: {
        type: DataTypes.STRING,
        allowNull: true
    },
    HelplineNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    PinCode: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Website: {
        type: DataTypes.STRING,
        allowNull: true
    },
    NumberOfBeds: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    DonorType: {
        type: DataTypes.JSON, // Stores as JSON string in SQLite
        allowNull: false
    },
    DonationType: {
        type: DataTypes.JSON,
        allowNull: false
    },
    ComponentType: {
        type: DataTypes.JSON,
        allowNull: true
    },
    BagType: {
        type: DataTypes.JSON,
        allowNull: true
    },
    TTIType: {
        type: DataTypes.JSON,
        allowNull: true
    },
    Remarks: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    ChargeTarrifDetails: {
        type: DataTypes.JSON,
        allowNull: true
    },
    AreaDetails: {
        type: DataTypes.JSON,
        allowNull: true
    },
    StorageDetails: {
        type: DataTypes.JSON,
        allowNull: true
    },
    RefreshmentDetails: {
        type: DataTypes.JSON,
        allowNull: true
    },
    UserType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Availability: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    BloodType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    LastUpdated: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'BloodBanks',
    timestamps: true
});

module.exports = BloodBank;