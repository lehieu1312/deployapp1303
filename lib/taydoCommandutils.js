var Q = require('q'),
    crossSpawn = require('cross-spawn');

let execCordovaCommand = (optionList) => {
    var deferred = Q.defer();

    var cordovaProcess = crossSpawn.spawn('cordova', optionList);
    cordovaProcess.stdout.on('data', function(data) {
        console.log('data out: ' + data.toString());
    });
    cordovaProcess.stderr.on('data', function(data) {
        if (data instanceof Error) {
            //console.log(chalk.bold(data.toString()));
            console.log('data error: ' + data.toString());
        }
    });

    cordovaProcess.on('close', function(code) {
        if (code > 0) {
            return deferred.reject(code);
        }
        return deferred.resolve();
    });

    return deferred.promise;
}

let cmdLine = (cmd, optionList) => {
    return new Promise((resolve, reject) => {
        var commandLine = crossSpawn.spawn(cmd, optionList);
        commandLine.stdout.on('data', function(data) {
            console.log('data out: ' + data.toString());
        });
        cordovaProcess.stderr.on('data', function(data) {
            console.log('data error: ' + data.toString());
            if (data instanceof Error) {
                //console.log(chalk.bold(data.toString()));
                return reject(data);

            }
        });
        commandLine.on('close', function(code) {
            if (code > 0) {
                return reject(code);
            }
            return resolve('Success commandline.');
        });
    })
}

let execIonicCommand = (optionList) => {
    var deferred = Q.defer();

    var ionicProcess = crossSpawn.spawn('ionic', optionList);

    ionicProcess.stdout.on('data', function(data) {
        console.log('data out: ' + data.toString());
        // if (data instanceof Error) {

        // }
    });

    ionicProcess.stderr.on('data', function(data) {
        if (data) {
            //console.log(chalk.bold(data.toString()));
            console.log('data error: ' + data.toString());
        }
    });

    ionicProcess.on('close', function(code) {
        if (code > 0) {
            return deferred.reject(code);
        }
        return deferred.resolve();
    });

    return deferred.promise;
}

let execChmodCommand = (ListArgs) => {
    var deferred = Q.defer();

    var chmodCommand = crossSpawn.spawn('chmod', ListArgs);

    chmodCommand.stdout.on('data', function(data) {
        console.log('data out: ' + data.toString());
    });

    chmodCommand.stderr.on('data', function(data) {
        if (data) {
            //console.log(chalk.bold(data.toString()));
            console.log('data error: ' + data.toString());
        }
    });
    chmodCommand.on('close', function(code) {
        if (code > 0) {
            return deferred.reject(code);
        }
        return deferred.resolve();
    });

    return deferred.promise;
}
let zipFilter = (req, file, cb) => {
    // accept image only
    if (!file.originalname.match(/\.(zip)$/)) {
        return cb(new Error('Only zip files are allowed!'), false);
    }
    if (file.size > 150000000) {
        return cb(new Error(' Size file less than 150MB '));
    }
    cb(null, true);
};

module.exports = {
    zipFilter: zipFilter,
    execCordovaCommand: execCordovaCommand,
    execChmodCommand: execChmodCommand,
    execIonicCommand: execIonicCommand
};