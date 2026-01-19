const sequelize = require('./Database/Database');
const User = require('./Models/UserModel');
const BloodBank = require('./Models/BloodBankModel');
const DonationCamp = require('./Models/DonationCampModel');
const DonationRequest = require('./Models/DonationRequestModel');
const Fundraising = require('./Models/FundraisingModel');
const Location = require('./Models/LocationModel');
const Payment = require('./Models/PaymentModel');
const bcrypt = require('bcrypt');

const seedData = async () => {
    try {
        await sequelize.sync({ force: true }); // Reset DB
        console.log("Database reset and synced.");

        const saltRounds = 10;
        const commonPassword = await bcrypt.hash('password123', saltRounds);

        // --- Seed Users (50+) ---
        const users = [];
        const states = [
            // States (28)
            "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
            "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
            "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
            "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
            "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
            "Uttar Pradesh", "Uttarakhand", "West Bengal",
            // Union Territories (8)
            "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
            "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
        ];
        const districts = {
            // States
            "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati"],
            "Arunachal Pradesh": ["Itanagar", "Pasighat", "Tezu"],
            "Assam": ["Guwahati", "Dibrugarh", "Jorhat", "Silchar"],
            "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur"],
            "Chhattisgarh": ["Raipur", "Bilaspur", "Durg", "Korba"],
            "Goa": ["Panaji", "Margao", "Vasco da Gama"],
            "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
            "Haryana": ["Gurugram", "Faridabad", "Panipat", "Karnal"],
            "Himachal Pradesh": ["Shimla", "Dharamshala", "Mandi", "Solan"],
            "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
            "Karnataka": ["Bengaluru", "Mysuru", "Hubli", "Mangaluru"],
            "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
            "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur"],
            "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
            "Manipur": ["Imphal", "Thoubal", "Bishnupur"],
            "Meghalaya": ["Shillong", "Tura", "Jowai"],
            "Mizoram": ["Aizawl", "Lunglei", "Champhai"],
            "Nagaland": ["Kohima", "Dimapur", "Mokokchung"],
            "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Puri"],
            "Punjab": ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar"],
            "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
            "Sikkim": ["Gangtok", "Namchi", "Mangan"],
            "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
            "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam"],
            "Tripura": ["Agartala", "Udaipur", "Dharmanagar"],
            "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi"],
            "Uttarakhand": ["Dehradun", "Haridwar", "Nainital", "Roorkee"],
            "West Bengal": ["Kolkata", "Darjeeling", "Siliguri", "Durgapur"],
            // Union Territories
            "Andaman and Nicobar Islands": ["Port Blair", "Car Nicobar"],
            "Chandigarh": ["Chandigarh"],
            "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
            "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi"],
            "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla"],
            "Ladakh": ["Leh", "Kargil"],
            "Lakshadweep": ["Kavaratti", "Agatti"],
            "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"]
        };

        for (let i = 1; i <= 60; i++) {
            const state = states[i % states.length];
            const dists = districts[state];
            const district = dists[i % dists.length];

            users.push({
                FirstName: `User${i}`,
                LastName: `Lastname${i}`,
                DateOfBirth: "01-01-1990",
                Gender: i % 2 === 0 ? "Male" : "Female",
                Email: `user${i}@example.com`,
                State: state,
                District: district,
                PinCode: 110000 + i,
                MobileNumber: 9900000000 + i,
                Password: commonPassword,
                UserType: i <= 5 ? "Admin" : "Donor",
                isAdmin: i <= 5,
                Verified: true
            });
        }
        await User.bulkCreate(users);
        console.log(`Seeded ${users.length} Users.`);

        // --- Seed Blood Banks (10 per state) ---
        const bloodBanks = [];
        const categories = ["Government", "Private", "Charity", "Red Cross"];
        let bankId = 1;

        // Create 10 blood banks for each state
        for (const state of states) {
            const dists = districts[state];
            for (let j = 0; j < 10; j++) {
                const district = dists[j % dists.length];

                bloodBanks.push({
                    State: state,
                    District: district,
                    City: district,
                    BloodBank: `${state} Blood Bank ${j + 1}`,
                    Category: categories[bankId % categories.length],
                    ContactPerson: `Manager ${bankId}`,
                    Email: `bb${bankId}@bloodbank.com`,
                    Phone: `011-234567${bankId % 100}`,
                    Address: `${bankId} Main Street, ${district}, ${state}`,
                    PinCode: 110000 + bankId,
                    DonorType: JSON.stringify(["Voluntary", "Replacement"]),
                    DonationType: JSON.stringify(["Whole Blood", "Platelets"]),
                    AreaDetails: JSON.stringify([{ AreaName: "Donation Room A", AreaUsability: "Y", RoomNumber: "101" }]),
                    Availability: "Available",
                    Type: "Main"
                });
                bankId++;
            }
        }
        await BloodBank.bulkCreate(bloodBanks);
        console.log(`Seeded ${bloodBanks.length} Blood Banks (10 per state).`);

        // --- Seed Donation Camps (50+) ---
        const camps = [];
        for (let i = 1; i <= 55; i++) {
            const state = states[i % states.length];
            camps.push({
                CampName: `Mega Camp ${i}`,
                ConductedBy: `Hospital ${i}`,
                OrganizedBy: `NGO ${i}`,
                Email: `camp${i}@ngo.org`,
                State: state,
                District: districts[state][0],
                Date: `2026-02-${(i % 28) + 1}`,
                Time: "10:00 AM - 04:00 PM",
                Contact: `98765432${i % 100}`,
                Address: `Community Hall, Area ${i}, ${state}`
            });
        }
        await DonationCamp.bulkCreate(camps);
        console.log(`Seeded ${camps.length} Donation Camps.`);

        // --- Seed Fundraising (30+) ---
        const fundraisings = [];
        for (let i = 1; i <= 35; i++) {
            fundraisings.push({
                UserID: `user${(i % 50) + 1}`,
                Email: `user${(i % 50) + 1}@example.com`,
                Heading: `Save Life ${i}`,
                Amount: 50000 + (i * 1000),
                RecievedFunds: i * 500,
                Description: `Urgent need for funding for marrow transplant surgery ${i}.`,
                Image: "https://res.cloudinary.com/dhp9cooxt/image/upload/v1652097466/Background/Default%20Background.jpg"
            });
        }
        await Fundraising.bulkCreate(fundraisings);
        console.log(`Seeded ${fundraisings.length} Fundraising campaigns.`);

        // --- Seed Payments (200+) ---
        const payments = [];
        for (let i = 1; i <= 210; i++) {
            payments.push({
                EMAIL: `user${(i % 50) + 1}@example.com`,
                MOBILE_NO: `99000000${(i % 99) + 1}`,
                RECIEVER_RREQUEST_ID: `REQ_${i}`,
                RECIEVER_EMAIL: `ngo${(i % 10) + 1}@ngo.org`,
                TXNID: `TXN${Date.now()}${i}`,
                BANKTXNID: `BTXN${i}9876`,
                ORDERID: `ORD${i}555`,
                TXNAMOUNT: `${100 * (i % 10 + 1)}`,
                STATUS: i % 10 === 0 ? "FAILED" : "SUCCESS",
                TXNTYPE: "SALE",
                GATEWAYNAME: i % 2 === 0 ? "PAYTM" : "RAZORPAY",
                RESPCODE: "01",
                RESPMSG: "Txn Success",
                BANKNAME: "HDFC BANK",
                MID: "MID_998877",
                PAYMENTMODE: "UPI",
                REFUNDAMT: "0.00",
                TXNDATE: new Date().toISOString()
            });
        }
        await Payment.bulkCreate(payments);
        console.log(`Seeded ${payments.length} Payment records.`);

        // --- Seed Locations (All states & their districts) ---
        const locationData = [];
        let stateIdx = 1;
        for (const state in districts) {
            locationData.push({
                index: stateIdx,
                state: state,
                district: JSON.stringify(districts[state].map((d, i) => ({ index: i + 1, name: d })))
            });
            stateIdx++;
        }
        await Location.bulkCreate(locationData);
        console.log(`Seeded ${locationData.length} States/Districts.`);

        console.log("SUCCESS: All data seeded properly!");
        process.exit(0);
    } catch (error) {
        console.error("ERROR Seeding Data:", error);
        process.exit(1);
    }
};

seedData();
