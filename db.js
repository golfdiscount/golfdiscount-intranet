let fs = require("fs")
//const serverCa = [fs.readFileSync("certs\\BaltimoreCyberTrustRoot.crt.pem", "utf8")];
dbConnection = {
  host: "wsi-orders.mysql.database.azure.com",
  user: "harmeet@wsi-orders",
  password: "%a5xe2*S4xxd^MDmyqFFd!qrwSGKBPN&QCPiXtDV&&=xE7=SyumA%>:zLGEuo].E",
  database: 'wsi_stack',
  multipleStatements: true,
  //ssl: {
  //  rejectUnauthorized: true,
  //  ca: serverCa
  //}
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