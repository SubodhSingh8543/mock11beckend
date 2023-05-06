// mongodb+srv://subodhsingh8543:mock10@cluster0.8cfo8uv.mongodb.net/?retryWrites=true&w=majority
require("dotenv").config();
const mongoose = require("mongoose")

const connect = mongoose.connect(`${process.env.mongoURL}`)

module.exports = {connect}