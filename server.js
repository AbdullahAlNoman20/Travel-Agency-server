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


app.get("/register_users",(req,res)=>{
   const sql = "SELECT * FROM register_users";
   db.query(sql,(err,data)=>{
    if(err){
        console.error("error " + err.stack)
        return res.json("Error occurs: beep beep")
    }
    return res.json(data)
   })
})



// Post Data In DB
app.post('/register_users', async(req,res)=>{

        const userName =  req.body.userName
        // const number = req.body.number
        const email = req.body.email
        const password = req.body.password

      db.query ("INSERT INTO register_users (userName,email,password) VALUES(?,?,?)",[userName,email,password]),
        (err,result)=>{
            if(result){
                res.send(result)
            }
            else{
                res.send(err)
            }
        }
})



app.listen(5000,()=>{
    console.log(`Server in running on port ${port}`)
})
