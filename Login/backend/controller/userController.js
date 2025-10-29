const {v4 : uuidv4} = require("uuid");
const jwt = require('jsonwebtoken');
const userSchema = require("../model/userModel");
const bcrypt = require("bcryptjs");
const {createTable,checkRecordExists,insertRecord} = require("../db/sqlFunctions");

const generateAccessTokens = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET_KEY, {expiresIn:"7d"});
};

const register = async (req,res) => {
    const {email,password} = req.body;
    if(!email || !password){
        res
            .status(400)
            .json({error: "Email or Password feilds can't be empty!"});
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    const user = {
        userId : uuidv4(),
        email,
        password: hashedPassword,
    };

    try{
        await createTable(userSchema);
        const userAlreadyExists = await checkRecordExists("user","email",email);
        if(userAlreadyExists){
            res.status(409).json({error:"Email already Exists"});
        }else{
            await insertRecord("user",user);
            res.status(201).json({message:"User created successfully!"});
        }
    }catch(error){
        res.status(500).json({error: error.message});
    }
};

const login = async (req,res) => {
    const {email,password} = req.body;

    if(!email || !password){
        res.status(400).json({error:"Email or Password fields cannot be empty!"});
        return;
    }

    try{
        const existingUser = await checkRecordExists("user","email",email);

        if(existingUser){
            if(!existingUser.password){
                res.status(401).json({error:"Invalid credentials"});
                return;
            }

            const passwordMatch = await bcrypt.compare(
                password,
                existingUser.password
            );

            if(passwordMatch){
                res.status(201).json({
                    userId: existingUser.userId,
                    email : existingUser.email,
                    access_token: generateAccessTokens(existingUser.userId),
                });
            }else{
                res.status(401).json({error:"Invalid credentials"});
            }
        }else{
            res.status(401).json({error:"Invalid credentials"});
        }
    }catch(error){
        res.status(500).json({error:error.message});
    }
}

module.exports = {
    register,
    login
};