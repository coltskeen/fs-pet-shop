let fs = require('fs');

function read(param) {
    fs.readFile('./pets.json', 'utf8', function(error, data) {
        let parsedData = JSON.parse(data);
        if (parsedData[param]) {
            console.log(parsedData[param]);
        } else {
            console.log("Usage: node pets.js read INDEX");
        }
    })
}

function create() {
    
}



let subcommand = process.argv[2];
if (subcommand === "read") {
    let param = process.argv[3];
    read(param);
} else if (subcommand === "create") {
    console.log("creating file");
} else if (subcommand === "update") {
    console.log("updating file");
} else if (subcommand === "destroy") {
    console.log("destroying file");
} else {
    console.error("Usage: node pets.js [read | create | update | destroy]");
    // process.exit(1);
}
