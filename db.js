dbConnection = {
  host: "wsi-orders.mysql.database.azure.com",
  user: "harmeet_pgd@wsi-orders",
  password: "%a5xe2*S4xxd^MDmyqFFd!qrwSGKBPN&QCPiXtDV&&=xE7=SyumA%>:zLGEuo].E",
  database: 'wsi',
  multipleStatements: true
}

let mysql = require("mysql2");
let connection = mysql.createConnection(dbConnection);

exports.connect = function () {
  connection.connect((err) => {
    if (err) {
      console.error('error connecting:\n' + err.stack);
    } else {
      console.log('connected as id ' + connection.threadId);
    }
  });
}

exports.executeQuery = function(query, handler) {
  connection.query(query, function(error, results, fields) {
      handler(results, error);
  });
}