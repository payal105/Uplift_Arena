const MongoClient = require("mongodb").MongoClient;

const uri = "mongodb+srv://uplift:uplift%4012345678@cluster0.e9yk8ur.mongodb.net/test?retryWrites=true&w=majority";

async function checkAdmins() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("test");
    const userdatas = db.collection("userdatas");
    
    const adminUsers = await userdatas.find({ email: "admin@admin.com" }).toArray();
    console.log(`Found ${adminUsers.length} users with email admin@admin.com:`);
    adminUsers.forEach((user, index) => {
      console.log(`\n--- User ${index + 1} ---`);
      console.log(`ID: ${user._id}`);
      console.log(`Name: ${user.name}`);
      console.log(`isAdmin: ${user.isAdmin}`);
      console.log(`Created: ${user.createdAt}`);
    });
  } finally {
    await client.close();
  }
}

checkAdmins();
