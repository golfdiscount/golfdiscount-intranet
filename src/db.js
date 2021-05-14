dbConnection = {
  host: "localhost",
  user: "root",
  password: "R@YaLagpjgeWsG]^ce)c",
  database: 'wsi_stack',
  multipleStatements: true
}

let mysql = require("mysql");
let connection = mysql.createConnection(dbConnection)

exports.connect = function () {
  connection.connect((err) => {
    if (err) {
      console.error('error connectiong:\n' + err.stack);
      return;
    }
    console.log('connected as id ' + connection.threadId);
  })
}

exports.executeQuery = function(query, handler) {
  try {
    connection.query(query, function(error, results, fields) {
      if (error) {
        console.log(error);
      }
      handler(results);
    });
  } catch (e) {
    console.log("There was an error with your query\n")
  }
}