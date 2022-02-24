'use strict';

const http = require("http");
const fs = require("fs");
const PORT = 5080;
const petRegExp = /^\/pets\/(.*)$/;

const server = http.createServer((req, res) => {

    if(req.method === 'GET' && req.url === "/pets" ) {
        fs.readFile("./pets.json", 'utf8', (err, data) => {
            if(err){
                res.statusCode = 500;
                res.statusMessage = "ERROR: Problem reading file.";
                res.end();
            } else {
                res.writeHeader(200, {"Content-Type": "application/json"});
                res.write(data);
                res.end();
            }
        });
    } else if (req.method === "GET" && petRegExp.test(req.url)){
        let index = Number(req.url.match(petRegExp)[1]);
        // console.log(index);
        fs.readFile("./pets.json", 'utf8', (err, data) => {
            let parsedData = JSON.parse(data);
            if(err){
                res.statusCode = 500;
                res.statusMessage = "ERROR: Problem reading file.";
                res.end();
            } else if (parsedData[index]) {
                res.writeHeader(200, {"Content-Type": "application/json"});
                res.write(JSON.stringify(parsedData[index]));
                res.end();
            } else {
                res.statusCode = 404;
                res.setHeader("Content-Type", "text/plain");
                res.write("Not Found");
                res.end();
            }
        });
    } else if (req.method === "GET" && !petRegExp.test(req.url)) {
        fs.readFile("./pets.json", 'utf8', (err, data) => {
            let parsedData = JSON.parse(data);
            if(err){
                res.statusCode = 500;
                res.statusMessage = "ERROR: Problem reading file.";
                res.end();
            } else {
                res.statusCode = 404;
                res.setHeader("Content-Type", "text/plain");
                res.write("Not Found");
                res.end();
            }
        });
    }

});

server.listen(PORT);
console.log(`Server is listening on PORT: ${PORT}`);

module.exports = server;