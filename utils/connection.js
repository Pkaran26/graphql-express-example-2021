var {MongoClient, ObjectID} = require('mongodb');
var url = "mongodb://localhost:27017";


const connection = (collection)=>{
  return new Promise((resolve, reject)=>{
    MongoClient.connect(url, function(err, client) {
      if (err) return reject()
      const db = client.db("blog")
      resolve({ client: client, db: db.collection(collection) })
    })
  })
}
module.exports = connection

// dbo.collection("post").insertMany(newJson, function(err, res) {
//   if (err) throw err;
//   console.log("1 document inserted");
//   db.close();
// });
