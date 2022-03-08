//IMPORT EXPRESS AND FS
const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 5050;

//ESTABLISH MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//POST REQUEST
app.post('/pets', (req, res) => {
    let { age, kind, name } = req.body;
    let newPet = { age, kind, name };

    //if age, kind or name are undefined then return bad request error
    if (!age || !kind || !name) {
        res.status(400).send("Bad Request");
    }
    
    //read the current file and write the updates to it
    fs.readFile('pets.json', "utf-8", (err, data) => {
        let parsedData = JSON.parse(data);
        parsedData.push(newPet);
        fs.writeFile("pets.json", JSON.stringify(parsedData), (err) => {
            if(err) { 
                res.status(500).send();
            } else { 
                res.set("Content-Type", "application/json").status(201).send(newPet); 
            }
        });
    });
});

//GET REQUEST AT INDEX
app.get("/pets/:id", (req, res) => {
    let id = req.params.id;
    fs.readFile("./pets.json", "utf-8", (err, data) => {
        let parsedData = JSON.parse(data);
        if (err) {
            res.status(400).send("Bad Request");
        } else if (parsedData[id]) {
            res.set("Content-Type", "application/json").status(200).send(parsedData[id]);
        } else {
            res.set("Content-Type", "text/plain"). status(404).send("Not Found");
        }
    });
});

//PATCH REQUEST AT INDEX
app.patch('/pets/:id', (req, res) => {
    let id = req.params.id;
    let updatedPet = req.body;

    // define the patch
    fs.readFile("./pets.json", "utf8", (err, data) => {
        let parsedData = JSON.parse(data);
        parsedData[id] = { ...parsedData[id], ...updatedPet};

        fs.writeFile("./pets.json", JSON.stringify(parsedData), (err) => {
            if(err) { 
                res.status(500).send();
            } else { 
                res.set("Content-Type", "application/json").status(201).send(parsedData); 
            }
        })
            
    });

});

app.listen(PORT, () => console.log("Listening on PORT: " + PORT));