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


//BONUS 1: WRITE A FUNCTION TO UPDATE EXISTING RECORDS
function update(index, updatedAnimal) {
    let currValues = JSON.parse(fs.readFileSync('./pets.json', 'utf-8'));
    updatedAnimal.age = Number(updatedAnimal.age);
    currValues[index] = updatedAnimal;
    fs.writeFile("./pets.json", JSON.stringify(currValues), (err) => {
        if (process.argv[3] === undefined || updatedAnimal.age === undefined || updatedAnimal.kind === undefined || updatedAnimal.name === undefined) {
            console.error("Usage: node pets.js update INDEX AGE KIND NAME");
            process.exit(1);
        } else {
            console.log(updatedAnimal);
        }
    })
}

//BONUS 2: WRITE A FUNCTION TO DESTROY EXISTING RECORDS
function destroy(index) {
    let currValues = JSON.parse(fs.readFileSync('./pets.json', 'utf-8'));
    console.log(currValues[index]);
    currValues.splice(index, 1);
    fs.writeFile("./pets.json", JSON.stringify(currValues), (err) => {
        if (process.argv[3] === undefined) {
            console.error("Usage: node pets.js destroy INDEX");
            process.exit(1);
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
    let index = process.argv[3];
    let updatedAnimal = {
        age: process.argv[4],
        kind: process.argv[5],
        name: process.argv[6]
    }
    update(index, updatedAnimal);
} else if (subcommand === "destroy") {
    let index = process.argv[3];
    destroy(index);
} else {
    console.error("Usage: node pets.js [read | create | update | destroy]");
    process.exit(1);
}
