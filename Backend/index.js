const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();
const app = express();
const Port = 8000;
const db = require("./db");

const Register = require("./Models/Register");

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({
        messaage: "Server is working"
    });
})
// Register API
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // First of all I want to check If user exist 
        // Then we have to return
        const userExists = await Register.findOne({ email });
        if (userExists) {

            return res.status(409).json({ message: 'Email already exists' });

        }
        // If not 
        const newUser = new Register({
            name,
            email,
            password
        })
        await newUser.save();
        res.status(200).json({
            message: "Registration Successful"
        })
    } catch (error) {
        res.status(500).json({
            messaage: error.message
        })
    }
})

// Login API

app.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body;
        const existUser = await Register.findOne({ email, password });
        if (!existUser) {
            return res.status(401).json({
                messaage: "Invalid Credentials"
            })
        }
        // req.session.existUser = existUser._id;
        res.json({
            email,
            password,
            messaage: "Login Successful"
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})







app.listen(Port, (req, res) => {
    console.log(`Server is running on the Port ${Port}`);
})