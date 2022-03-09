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

    pool
        .query("SELECT * FROM pets WHERE id = $1;", [id])
        .then((result) => {
            //if the result at that id has no data in the table return 404 error
            if (result.rows.length === 0) return res.status(404).send("Not Found");
            //else return the table data
            else return res.send(result.rows[0]);
        })
        .catch((err) => res.sendStatus(500));
});

//PATCH REQUEST AT INDEX
app.patch('/pets/:pet_id', (req, res) => {
    let id = req.params.pet_id;
    let { name, age, kind } = req.body;

    let query = `
    UPDATE pets SET
        name = COALESCE($1, name),
        age = COALESCE($2, age),
        kind = COALESCE($3, kind)
    WHERE id = $4 RETURNING *;`
    ;

    pool
        .query(query, [name, age, kind, id])
        .then((result) => {
            if (result.rows.length === 0) return res.status(404).send("Not Found");
            else return res.status(201).send(result.rows[0]);
        })
        .catch((err) => res.sendStatus(500));
});

//DELETE REQUEST
app.delete("/pets/:pet_id", (req, res) => {
    let id = req.params.pet_id;
    
    pool
        .query("DELETE FROM pets WHERE id=$1;", [id])
        .then((result) => {
            if(result.rowCount === 0) return res.status(404).send("Not Found");
            else return res.sendStatus(204);
        })
        .catch((err) => res.sendStatus(500));
});

//CATCH-ALL ERROR HANDLING
app.use((req, res, next) => {
    res.status(404).send("Not Found");
})

app.listen(PORT, () => console.log("Listening on PORT: " + PORT));
module.exports = pool;