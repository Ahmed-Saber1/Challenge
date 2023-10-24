const { USER } = require('../models/userModel');
const { userDto } = require('../dto/userDto');
const bcrypt = require('bcrypt');
const generateUniqueId = require('generate-unique-id');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET || "LookAtMe";

async function createAccount(req, res) {
    try{
        const {name, password, role} = req.body;
        const user = new USER({
            id: generateUniqueId({
                length: 15,
                useLetters: false
            }),
            name,
            role
        })
        
        const hashedPassword = bcrypt.hashSync(password, 10);
        user.password = hashedPassword;
        delete user.__v;

        await user.save();
        
        res.status(201).json(userDto(user));   
    }catch(err){
        res.status(500).json({
            code: "500",
            message: "Internal Server Error"
        });   
    }
}

async function getToken(req,res) {
    try{
        const credentials = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString();
        const id = credentials.split(':')[0];
        const password = credentials.split(':')[1];
    
        var user = await USER.findOne({id});
        if(!user) return res.status(400).json({msg: "Username or Password is not matching."});
    
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if(!isValidPassword)  return res.status(400).json({msg: "Username or password is not matching."});
    
        user = userDto(user);
        const token = jwt.sign(user, secret, { expiresIn: '1h' });
    
        res.status(200).json({
            id,
            token,
            expiresIn: "60 Minutes"
        });
    }catch(err){
        res.status(500).json({
            code: "500",
            message: "Internal Server Error"
        }); 
    }
}

module.exports = {
    createAccount,
    getToken
}