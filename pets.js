// console.log(process.argv);

//IMPORT FS
let fs = require('fs');

//READ FUNCTIONS
function read(index) {
    fs.readFile('./pets.json', 'utf8', function(error, data) {
        let parsedData = JSON.parse(data);
        if (error) {
            throw error;
        } else if (parsedData[index]) {
            console.log(parsedData[index]);
        } else if (index > parsedData.length - 1 || index < parsedData[0]) {
            console.error("Usage: node pets.js read INDEX");
            process.exit(1);
        } else {
            console.log(parsedData);
        }
    })
}


//WRITE FUNCTION TO CREATE A NEW OBJ THAT DOESN'T OVERRIDE OLD DATA
function create(newAnimal) {
    let currValues = JSON.parse(fs.readFileSync('./pets.json', 'utf-8'));
    newAnimal.age = Number(newAnimal.age);
    currValues.push(newAnimal);
    fs.writeFile("./pets.json", JSON.stringify(currValues), (error) => {
        if (newAnimal.age === undefined || newAnimal.kind === undefined || newAnimal.name === undefined) {
            console.error('Usage: node pets.js create AGE KIND NAME');
            process.exit(1);
        } else {
            console.log(newAnimal);
        }
    })
}



let subcommand = process.argv[2];
if (subcommand === "read") {
    let index = process.argv[3];
    read(index);
} else if (subcommand === "create") {
    let newAnimal = {
        age: process.argv[3],
        kind: process.argv[4],
        name: process.argv[5]
    }
    create(newAnimal);
} else if (subcommand === "update") {
    console.log("updating file");
} else if (subcommand === "destroy") {
    console.log("destroying file");
} else {
    console.error("Usage: node pets.js [read | create | update | destroy]");
    process.exit(1);
}
