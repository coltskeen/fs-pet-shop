//IMPORT EXPRESS AND FS
const express = require("express");
const fs = require("fs");


const app = express();
const PORT = 8000;
let petsData = JSON.parse(fs.readFileSync('./pets.json', 'utf-8'));

//ESTABLISH MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//GET REQUEST/RESPONSE
app.get("/pets", (req, res) => {
    req.get("Content-Type");
    res.set("Content-Type", "application/json").status(200).send(petsData);
});

app.get("/pets/:index", (req, res) => {
    let index = req.params.index;
    console.log(index);
    req.get("Content-Type");
    res.set("Content-Type", "application/json").status(200).send(petsData[index]);
});

app.listen(PORT, () => console.log("Listening on PORT: " + PORT));

//GET	/pets	200	application/json	[{ "age": 7, "kind": "rainbow", "name": "fido" }, { "age": 5, "kind": "snake", "name": "Buttons" }]