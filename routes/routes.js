const express = require("express");
const { UserModel } = require("../models/userModel");
const { BookModel } = require("../models/booksModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { authenticated } = require("../middlewares/authincated");
const routes = express.Router();
// name: String,
// email: String,
// password: String,
// isAdmin

routes.post("/register", (req, res) => {
    const { name, email, password, isAdmin } = req.body;
    try {
        bcrypt.hash(password, 5, async (err, hash) => {

            const user = await new UserModel({ name, email, password: hash, isAdmin });
            user.save();
            res.status(201).send({ "msg": "user registered successfuly" });
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({ "msg": "error occured" });
    }
});

routes.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.find({ email });
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, async (err, result) => {
                if (result) {
                    res.status(201).send({ "msg": "user registered successfuly", "token": jwt.sign({ userID: user[0]._id }, "subodh")});
                } else {
                    res.status(400).send({ "msg": "login Failed" });
                }
            })
        }else{
            res.status(400).send({"msg":"login Failed"});
        } 
    } catch (error) {
        console.log(error);
        res.status(400).send({ "msg": "error occured" });
    }
})

routes.post("/books",authenticated,async (req,res) => {
    const payload = req.body;
    try {
        const bookData = await new BookModel(payload);
        bookData.save()
        res.status(201).send({ "msg": "book added successfuly"})
    } catch (error) {
        console.log(error);
        res.status(400).send({ "msg": "error occured" });
    }
})

routes.get("/books/:id",async (req,res) => {
   
    const id = req.params.id;

    try {
        const bookData = await BookModel.find({_id:id});
        res.status(201).send(bookData)
    } catch (error) {
        console.log(error);
        res.status(400).send({ "msg": "error occured" });
    }
})


routes.get("/books",async (req,res) => {
   
    const { author, category} = req.query;

    try {
        if(author && category){
            const bookData = await BookModel.find({author,category});
            res.status(200).send(bookData)
        }else if(author){
            const bookData = await BookModel.find({author});
            res.status(200).send(bookData)
        }else if(category){
            const bookData = await BookModel.find({category});
            res.status(200).send(bookData)
        }else{
            const bookData = await BookModel.find();
        res.status(200).send(bookData)
        }
        
    } catch (error) {
        console.log(error);
        res.status(400).send({ "msg": "error occured" });
    }
})

routes.patch("/books/:id",async (req,res) => {
   
    const id = req.params.id;
    const body = req.body;

    try {
        const bookData = await BookModel.findByIdAndUpdate(id,body);
        res.status(204).send({"msg": "data has been updated successfully"})
    } catch (error) {
        console.log(error);
        res.status(400).send({ "msg": "error occured" });
    }
})

routes.delete("/books/:id",async (req,res) => {
   
    const id = req.params.id;

    try {
        const bookData = await BookModel.findByIdAndDelete(id);
        res.status(202).send({"msg": "data has been deleted successfully"})
    } catch (error) {
        console.log(error);
        res.status(400).send({ "msg": "error occured" });
    }
})

module.exports = { routes };