const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express()

app.use(cors());
app.use(express.json());

//Database connection
const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'todo'
})
db.connect((err) => {
    if (err){
        console.log("DB CONNECTION FAIL")
        return
    } 
    console.log("db connection sucessfull")

})

//Reterving of tasks from data base
app.get('/',(req,res) => {
    db.query('select * from todoitems',(err,results) =>{
        if(err) {
            console.log("error occured",err)
            return
        }
        console.log("data fatched sucessfully",results)
        res.send(results)
    })
})

//Storing the tasks in data base
app.post('/add-item',(req,res) => {
    console.log(req.body);
    db.query(`insert into todoitems(itemDescription) values('${req.body.text}')`,(err,results) =>{
        if(err) {
            console.log("error occured",err)
            return
        }
        console.log("created sucessfully")
    })
    res.send("added sucessfully")
})

//Editing task
app.put('/edit-item',(req,res) => {
    console.log("line 52",req.body)
    db.query(`UPDATE todoitems 
SET itemDescription = '${req.body.itemDescription}'
WHERE id = ${req.body.ID};`,(err,result) => {
    if(err) {
            console.log("error occured",err)
            return
        }
        console.log("edited sucessfully")
    })
})

//task deletion from database
app.delete('/delete/:id',(req,res) => {
    console.log(req.body)
    db.query(`DELETE FROM todoitems WHERE id = '${req.body.value}'`,(err,result) => {
        if(err) {
            console.log("error is :",err)
            return
        }
        res.send("Task deleted")
        console.log("deleted task")
    })
})

//Server SetUp
app.listen(3000,()=>{
    console.log("Server is running");
})