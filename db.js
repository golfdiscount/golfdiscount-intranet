dbConnection = {
  host: "wsi-orders.mysql.database.azure.com",
  user: "harmeet_pgd@wsi-orders",
  password: "%a5xe2*S4xxd^MDmyqFFd!qrwSGKBPN&QCPiXtDV&&=xE7=SyumA%>:zLGEuo].E",
  database: 'wsi'
}

let mysql = require("mysql2");
let connection = mysql.createPool(dbConnection);

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
  connection.end()
}