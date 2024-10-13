const express = require('express');
const mysql = require('mysql')
const cors = require('cors')
const port = process.env.PORT || 5000;
const app = express()


require('dotenv').config();


// Middleware
app.use(cors())
app.use(express.json())



// Create Connection with the Database
const db = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "project01"
})

// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASS)

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

// Show All User Info
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

// Show All packages Info
app.get("/package",(req,res)=>{
   const sql = "SELECT * FROM package";
   db.query(sql,(err,data)=>{
    if(err){
        console.error("error " + err.stack)
        return res.json("Error occurs: beep beep")
    }
    return res.json(data)
   })
})

// Specific Package
app.get('/package_details/:id',(req,res)=>{
    const id = req.params.id;
    const query = 'SELECT * FROM package WHERE id = ?';
    db.query(query, [id], (err, result) => {
     if(err){
        console.error('Error fetching package:', err);
        res.status(500).send('Error fetching package');
    }
     else {
        res.json(result[0]);
      }
    })
 })



// Post Data In DB
app.post('/register_users', async(req,res)=>{

    const newUser = req.body;
        const userName =  req.body.userName
        const email = req.body.email
        const password = req.body.password
    console.log(newUser)
    // newUser.id = register_users.length + 1;

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


// Post Data In DB
app.post('/package', async(req,res)=>{

    const newPackage = req.body
        const placeName =  req.body.placeName
        const description = req.body.description
        
    console.log(newPackage)

      db.query ("INSERT INTO package (placeName,description) VALUES(?,?)",[placeName,description]),
        (err,result)=>{
            if(result){
                res.send(result)
            }
            else{
                res.send(err)
            }
        }
})


// Delete Single Data
app.delete('/delete_package/:id', (req, result) => {
    const id = req.params.id;
  
    const query = 'DELETE FROM package WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Error deleting data:', err);
        res.status(500).send('Error deleting data');
      } else {
        res.send(`Deleted entry with ID: ${id}`);
      }
    });
  });

// Update Packages
app.get('/update_package/:id',(req,res)=>{
    const id = req.params.id;
    const query = 'SELECT * FROM package WHERE id = ?';
    db.query(query, [id], (err, result) => {
     if(err){
        console.error('Error fetching package:', err);
        res.status(500).send('Error fetching package');
    }
     else {
        res.json(result[0]);
      }
    })
 })

app.put('/updated_package/:id',async(req, res) => {
    const id = req.params.id;
    const updatedPackage = req.body;
    console.log(updatedPackage)
    const { placeName, description } = req.body;
  
    const query = 'UPDATE package SET placeName = ?, description = ? WHERE id = ?';
    db.query(query, [placeName, description, id], (err, result) => {
      if (err) {
        console.error('Error updating data:', err);
        res.status(500).send('Error updating data');
      } 
      if (result.affectedRows === 0) {
        // No rows updated, possibly because the package ID doesn't exist
        return res.status(404).json({ error: 'Package not found' });
      }
      else {
        // alert('Updated Successfully')
        res.send(`Updated entry with ID: ${id}`);
      }
    });
  });




app.listen(5000,()=>{
    console.log(`Server in running on port ${port}`)
})
