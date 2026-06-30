const mongoose = require('mongoose');

const uri = "mongodb+srv://delaridge88_db_user:crisis123@cluster0.6beqwvc.mongodb.net/?appName=Cluster0";

mongoose.connect(uri)
  .then(() => {
    console.log("Connected successfully to SRV!");
    process.exit(0);
  })
  .catch(err => {
    console.error("SRV failed:", err.message);
    const uri2 = "mongodb://delaridge88_db_user:crisis123@ac-ppyu62q-shard-00-00.6beqwvc.mongodb.net:27017,ac-ppyu62q-shard-00-01.6beqwvc.mongodb.net:27017,ac-ppyu62q-shard-00-02.6beqwvc.mongodb.net:27017/crisiseye?ssl=true&replicaSet=atlas-ppyu62q-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
    mongoose.connect(uri2)
      .then(() => {
        console.log("Connected successfully to bypass!");
        process.exit(0);
      })
      .catch(err2 => {
        console.error("Bypass failed:", err2.message);
        process.exit(1);
      });
  });
