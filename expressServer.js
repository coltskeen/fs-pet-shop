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
    req.get("Content-Type");
    fs.readFile("./pets.json", "utf8", (err, data) => {
        let parsedData = JSON.parse(data);
        if (err) {
            throw err;
        } else if (parsedData[index]) {
            res.set("Content-Type", "application/json").status(200).send(parsedData[index]);
        } else {
            res.set("Content-Type", "text/plain").status(404).send("Not Found");
        }
    })
});

//CATCH-ALL ERROR HANDLING
app.use((req, res, next) => {
    res.status(404).send("Not Found");
})

//LISTEN ON PORT
app.listen(PORT, () => console.log("Listening on PORT: " + PORT));

