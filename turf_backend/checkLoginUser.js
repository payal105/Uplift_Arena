const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");

const uri = "mongodb+srv://uplift:uplift%4012345678@cluster0.e9yk8ur.mongodb.net/test?retryWrites=true&w=majority";

async function checkUser() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("test");
    const userdatas = db.collection("userdatas");
    
    // Check the user ID from the login test
    const userId = new ObjectId("69d9f2e989c996a6874c4cb3");
    const user = await userdatas.findOne({ _id: userId });
    
    console.log("User with ID 69d9f2e989c996a6874c4cb3:");
    console.log(JSON.stringify(user, null, 2));
    
    // Also list all users with email "admin@admin.com"
    console.log("\n\nAll users with email 'admin@admin.com':");
    const allAdminUsers = await userdatas.find({ email: "admin@admin.com" }).toArray();
    console.log(JSON.stringify(allAdminUsers, null, 2));
  } finally {
    await client.close();
  }
}

checkUser();
