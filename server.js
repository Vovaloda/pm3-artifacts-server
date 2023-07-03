const express = require("express");
const mysql = require("mysql");
const cors =  require("cors");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

console.log(process.env.PORT);

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD, 
    database: process.env.DATABASE,
});

app.get('/levels', (req, res) =>{
    const sql1 = "SELECT * FROM levels";
    db.query(sql1, [req.body.email], (err, data) => {
        if(err){
            return res.json("Error");
        }
        else{
            return res.json(data);
        }
    });
});

app.post('/signup', (req, res) =>{

    const sql1 = "SELECT * FROM login WHERE email = ?";
    db.query(sql1, [req.body.email], (err, data) => {
        if(err){
            return res.json("Error");
        }
        if(data.length === 0){
            const sql = "INSERT INTO login (name, email, password) VALUES (?)";
            const values = [
                req.body.name,
                req.body.email,
                req.body.password,
            ];
            db.query(sql, [values], (err, data) => {
                if(err){
                    return res.json("Error");
                }
                return res.json("Succes");
            });
        }
        else{
            return res.json("AlreadyRegistered");
        }
    });
});

app.post('/login', (req, res) =>{
    const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if(err){
            return res.json("Error");
        }
        if(data.length > 0){
            return res.json({data1: data, msg:"Succes"});
        }
        else{
            return res.json("Fail");
        }
    });
});

app.post('/getCompletedLevels', (req, res) =>{
    const sql = "SELECT * FROM levelsOfPlayers WHERE playerId = ?";
    db.query(sql, [req.body.playerId], (err, data) => {
        if(err){
            return res.json("Error");
        }
        if(data.length >= 0){
            return res.json({data1: data, msg:"Succes"});
        }
    });
});

app.post('/addLevelByUser', (req, res) =>{
    const sql = "INSERT INTO `levelsOfPlayers` (`playerId`, `levelId`) VALUES (?)";
    const values = [
        req.body.playerId,
        req.body.levelId,
    ];
    db.query(sql, [values], (err, data) => {
        if(err){
            return res.json("Error");
        }
        else{
            return res.json({msg: "Succes"});
        }
    });
});

app.post('/deleteLevelByUser', (req, res) =>{
    const sql = "DELETE FROM levelsOfPlayers WHERE playerId  = ? AND levelId = ?";
    db.query(sql, [req.body.playerId, req.body.levelId], (err, data) => {
        if(err){
            return res.json("Error");
        }
        else{
            return res.json({msg: "Succes"});
        }
    });
});


app.listen(process.env.PORT || 8081, ()=>{
    console.log("Listening...");
})
