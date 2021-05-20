dbConnection = {
  host: "localhost",
  user: "root",
  password: "R@YaLagpjgeWsG]^ce)c",
  database: 'wsi_stack',
  multipleStatements: true
}

let mysql = require("mysql2");
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
  connection.query(query, function(error, results, fields) {
      handler(results, error);
  });
}