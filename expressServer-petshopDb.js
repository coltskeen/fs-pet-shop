//IMPORT EXPRESS AND FS
const express = require("express");
const fs = require("fs");
const { Pool } = require('pg');

const pool = new Pool({
    database: "petshop",
});

//TEST CONNECTION TO DATABASE
// pool.query('SELECT * FROM pets', (err, result) => {
//     console.log(result.rows); 
// });


const app = express();
const PORT = 5050;

//ESTABLISH MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//POST REQUEST
app.post('/pets', (req, res) => {
    let { name, age, kind } = req.body;
    
    pool
        .query("INSERT INTO pets(name, age, kind) VALUES($1, $2, $3) RETURNING *;", [
            name, 
            age, 
            kind,
        ])
        .then((result) => {
            console.log(result.rows);
            res.status(201).send(result.rows[0]);
        })
        .catch((err) => {
            res.sendStatus(500);
        });
});

//GET REQUEST AT INDEX
app.get("/pets/:pet_id", (req, res) => {
    let id = req.params.pet_id;

    //If the id isn't given return a 404 error
    if(!id) return res.status(404).send("Not Found");

    //else run the pool query
    else {
        pool
            .query("SELECT * FROM pets WHERE id = $1;", [id])
            .then((result) => {
                //if the result at that id has no data in the table return 404 error
                if (result.rows.length === 0) return res.status(404).send("Not Found");
                //else return the table data
                else return res.send(result.rows[0]);
            })
            .catch((err) => res.sendStatus(500));
    }
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

//DELETE REQUEST
app.delete("/pets/:id", (req, res) => {
    let id = req.params.id;

    fs.readFile("./pets.json", "utf-8", (err, data) => {
        let parsedData = JSON.parse(data);
        parsedData.splice(id, 1);

        fs.writeFile("./pets.json", JSON.stringify(parsedData), (err) => {
            if (err) {
                res.status(500).send();
            } else if (parsedData) {
                res.set("Content-Type", "application/json").status(200).send("DELETE REQUEST SUCCESSFUL");
            } else {
                res.set("Content-Type", "text/plain"). status(404).send("Not Found");
            }
        })
    })
})

//CATCH-ALL ERROR HANDLING
app.use((req, res, next) => {
    res.status(404).send("Not Found");
})

app.listen(PORT, () => console.log("Listening on PORT: " + PORT));
module.exports = pool;