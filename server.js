const express=require("express");
const app = express();
const bcrypt=require("bcrypt");
const cors=require("cors");
const mongoose=require("mongoose");
const users = require("./schema");
app.use(cors({}));
app.use(express.json());
(async()=>{
    const connect=await mongoose.connect("mongodb+srv://nitinjha2609:notesmanager@cluster0.fetyubc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    if(connect){
        console.log("MongoDB connected")
    }
    else{
        console.log("Error while connecting to MongoDB")
    }
})()

app.get("/get", async(req, res)=>{
    const usertofind = await users.find();
    res.send(usertofind);
})

app.post("/signup", async(req, res)=>{
    const {username, password} = req.body;
    if (await users.findOne({username: username})){
        res.send("Username already exists!");
        return
    }
    const salt= await bcrypt.genSalt(10)
    const hash=await bcrypt.hash(password, salt);
    const usertoadd= new users({username:username, password: hash});
    const addeduser= await usertoadd.save();
    res.send("Account created successfully")
})

app.post("/login", async(req, res)=>{
    const {username, password} = req.body;
    if(!await users.findOne({username: username})){
        res.send("Username doesn't exist, try signing up instead");
        return
    }
    const db = await users.findOne({username: username});
    const result = await bcrypt.compare(password, db.password);
    if(result){
        res.send("Logged in successfully");
    }
    else{
        res.send("Wrong password, try again")
    }
})
app.get("/count", async(req, res)=>{
    const count = await users.countDocuments({});
    res.send("Total number of accounts in my database: " + count)
})

app.post("/delete", async(req, res)=>{
    const {username, password} = req.body;
    if(!await users.findOne({username: username})){
        res.send("Username doesn't exist, try again.");
        return
    }
    const db = await users.findOne({username: username});
    const result = await bcrypt.compare(password, db.password);
    if(result){
        await users.deleteOne({username: db.username});
        res.send("Acccount deleted successfully")
    }
    else{
        res.send("Wrong password, try again.");
        return
    }
})

module.exports=app