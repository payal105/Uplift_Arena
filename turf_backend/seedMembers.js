const mongoose = require("mongoose");
const UserData = require("./src/models/UserData");
const { hashPassword } = require("./src/utils/hash");
require("dotenv").config();

const membersData = [
  { name: "Rahul Agarwal", phone: "98323-55580", email: "ca.rahulslg@gmail.com", passwordRaw: "rahul@1234" },
  { name: "Sourav Berlia", phone: "", email: "sauravberlia.bff@gmail.com", passwordRaw: "soura@1234" },
  { name: "Nirmal Sharma", phone: "70471-68949", email: "nirmal86kaushik@gmail.com", passwordRaw: "nirma@1234" },
  { name: "Mudit Agarwal", phone: "97330-06606", email: "agmudit@gmail.com", passwordRaw: "mudit@1234" },
  { name: "Gopal Dalmia", phone: "98326-58683", email: "gopal.dalmia13@gmail.com", passwordRaw: "gopal@1234" },
  { name: "Akash Biswakarma", phone: "90021-12068", email: "akash@mytripmakers.in", passwordRaw: "akash@1234" },
  { name: "Rohit Agarwal", phone: "98324-33492", email: "rohit@kamac.in", passwordRaw: "rohit@1234" },
  { name: "Rahul Bansal", phone: "97752-81111", email: "r1.rahulbansal@gmail.com", passwordRaw: "rahul@1234" },
  { name: "Vamika Bansal", phone: "97752-81111", email: "wamikabansal3@gmail.com", passwordRaw: "vamik@1234" },
  { name: "Akash Agarwal", phone: "96419-11191", email: "akash.agarwal711@gmail.com", passwordRaw: "akash@1234" },
  { name: "Shakti Agarwal", phone: "98000-11911", email: "skt.shakti@gmail.com", passwordRaw: "shakt@1234" },
  { name: "Nancy Gupta", phone: "97347-79899", email: "nancykansal6557@gmail.com", passwordRaw: "nancy@1234" },
  { name: "Sahil Kedia", phone: "97330-05945", email: "sahilkedia3@gmail.com", passwordRaw: "sahil@1234" },
  { name: "Angel Gupta", phone: "93825-48483", email: "angelgupta2924@gmail.com", passwordRaw: "angel@1234" },
  { name: "Aishwarya Gupta", phone: "78650-50144", email: "aishwaryagupta062002@gmail.com", passwordRaw: "aishw@1234" },
  { name: "Akshay Sarawgi", phone: "94347-56789", email: "doon.akshay@gmail.com", passwordRaw: "aksha@1234" },
  { name: "Dr. Rajesh Kumar", phone: "97493-87705", email: "orthocarepoint@gmail.com", passwordRaw: "rajes@1234" },
  { name: "Mrs. Neelam Kumari", phone: "79081-86863", email: "neelam2305@yahoo.com", passwordRaw: "neela@1234" },
  { name: "Aman Agarwal", phone: "84671-99068", email: "amanagarwal477@gmail.com", passwordRaw: "amana@1234" }
];

const seedMembers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/test");
    console.log("✅ Connected to MongoDB");

    for (let member of membersData) {
      const existingUser = await UserData.findOne({ email: member.email });
      if (existingUser) {
        console.log(`⚠️ User with email ${member.email} already exists. Skipping...`);
        continue;
      }

      const hashedPassword = await hashPassword(member.passwordRaw);

      const newUser = new UserData({
        name: member.name,
        email: member.email,
        phone: member.phone,
        password: hashedPassword,
        isVerified: true,
        isActive: true,
        isMember: 1
      });

      await newUser.save();
      console.log(`✅ Created user: ${member.name} (${member.email}) | Password: ${member.passwordRaw}`);
    }

    console.log("===========================");
    console.log("🎉 Membership initial sync completed successfully!");
    console.log("===========================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error running seed script:", error);
    process.exit(1);
  }
};

seedMembers();
