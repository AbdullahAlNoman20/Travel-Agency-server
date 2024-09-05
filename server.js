const express = require('express');
const mysql = require('mysql')
const cors = require('cors')
const port = process.env.PORT || 5000;
const app = express()


// Middleware
app.use(cors())
app.use(express.json())



// Create Connection with the Database
const db = mysql.createConnection({
    host: "localhost",
    user: "noman",
    password: "12345",
    database: "project01"
})


// Check the DB Perfectly connect or not
db.connect((error)=>{
    if (error){
        console.error("No Connection with DB " + error.stack)
    }
    else{
        console.log("Successfully Connect with sql DB")
    }
})








app.get('/',(req,res)=>{
    return res.json("Server is running")
})


app.get("/userinfo",(req,res)=>{
   const sql = "SELECT * FROM userinfo";
   db.query(sql,(err,data)=>{
    if(err){
        console.error("error " + err.stack)
        return res.json("Error occurs: beep beep")
    }
    return res.json(data)
   })
})




app.listen(5000,()=>{
    console.log(`Server in running on port ${port}`)
})
