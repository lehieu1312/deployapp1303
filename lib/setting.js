var devMode = true;
// var httpHost = 'https://dev.deployapp.net';
// var httpHost = 'https://localhost:3000';
var statusPayment = {
    1: "Pending payment",
    2: "Processing",
    3: "On hold",
    4: "Completed",
    5: "Cancelled",
    6: "Refunded",
    7: "Failed"
}
var totalBuilding = 4;
var runningMacOS = true;
var hostIOS = 'http://198.8.83.70';
// var hostIOS = 'http://198.8.83.114';
// var hostIOS = 'http://localhost:3000';
var httpProtocol = true;
// var hostServer = 'https://dev.deployapp.net';
var hostServer = 'https://deployapp.net';
// var hostServer = 'http://localhost:3000';
var pathBackupDB = '/var/deployapp/public/backupdb/';
// var pathBackupDB = 'E:\\TayDoTech\\Nodejs\\Project\\deployapp\\public\\backupdb\\';
var verTypeScriptCheck = '2.3.2';
module.exports = {
    devMode: devMode,
    // httpHost: httpHost,
    statusPayment: statusPayment,
    totalBuilding: totalBuilding,
    hostIOS: hostIOS,
    httpProtocol: httpProtocol,
    pathBackupDB: pathBackupDB,
    hostServer: hostServer,
    runningMacOS: runningMacOS,
    verTypeScriptCheck: verTypeScriptCheck
}