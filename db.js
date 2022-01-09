const dbConnection = {
  host: process.env.dbHost,
  user: process.env.dbUser,
  password: process.env.dbPass,
  database: process.env.dbSchema
}

const mysql = require("mysql2");
const connection = mysql.createPool(dbConnection);

exports.connect = () => {
  connection.connect((err) => {
    if (err) {
      console.error('error connecting:\n' + err.stack);
    } else {
      console.log('connected as id ' + connection.threadId);
    }
  });
}

exports.executeQuery = (query, handler) => {
  connection.query(query, function(error, results, fields) {
      handler(results, error);
  });
}

exports.end= () => {
  connection.end();
}