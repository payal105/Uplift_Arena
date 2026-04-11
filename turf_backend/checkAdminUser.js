const MongoClient = require("mongodb").MongoClient;

const uri = "mongodb+srv://uplift:uplift%4012345678@cluster0.e9yk8ur.mongodb.net/test?retryWrites=true&w=majority";

async function checkAdmin() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("test");
    const userdatas = db.collection("userdatas");
    
    const adminUser = await userdatas.findOne({ email: "admin@admin.com" });
    console.log("Admin User Found:");
    console.log(JSON.stringify(adminUser, null, 2));
  } finally {
    await client.close();
  }
}

checkAdmin();
