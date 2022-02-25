import Express from "express";

const app = Express();
const PORT = 8000;

app.use(Express.json());
app.use(Express.urlencoded({extended: true}));

app.get();