var {MongoClient, ObjectID} = require('mongodb');
var url = "mongodb://localhost:27017";
const posts = require('./posts')

const convertToObjectID = (row)=>{
  const keys = Object.keys(row)
  for (var i = 0; i < keys.length; i++) {
    if(keys[i].indexOf('_id') > -1) {
      row[keys[i]] = new ObjectID(row[keys[i]])
    }
  }
  if(row.tags && row.tags.length > 0) {
    row.tags = row.tags.map((e)=>{
      return new ObjectID(e)
    })
  }
  return row
}

const newJson = posts.map((e)=>{
  return convertToObjectID(e)
})

// console.log(newJson);

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("blog");

  dbo.collection("post").insertMany(newJson, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});
