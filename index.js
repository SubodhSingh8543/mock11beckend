const express = require("express");
const { connect } = require("./db");
const { routes } = require("./routes/routes");
require("dotenv").config;

const app = express();
app.use(express.json());

app.use("/api",routes);


app.listen(process.env.port,async()=>{
    try {
        await connect;
        console.log("connected from database");
    } catch (error) {
        console.log("disconnected from database")
    }
})