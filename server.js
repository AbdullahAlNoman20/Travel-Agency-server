const express = require('express');
const mysql = require('mysql')
const cors = require('cors')
const port = process.env.PORT || 5000;
const app = express()
const bcrypt = require('bcryptjs');
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


// Gemini SetUp
// Make sure to include these imports:
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Generate Prompt
// app.get("/prompt", async(req,res)=>{
//   const prompt = "write a Story About a AI And magic"
//   const result = await model.generateContent(prompt)
//   const response = await result.response;
//   const text = response.text();
//   res.send({data: text, status: 200})
//   console.log(text);

// })

const form = `
<form method="POST" action="/prompt"> 
  <textarea name="prompt"id="prompt"></textarea>
  <button type="submit"> Generate </button>
</form>
`;

app.use(express.urlencoded({extended:true}))

app.get("/prompt",async(req,res)=>{
  res.send(form)
})

app.post("/prompt", async(req,res)=>{
  const {prompt} = req.body;
  const result = await model.generateContent(prompt)
  const response = await result.response;
  const text = response.text();
  // res.send({data: prompt, status: 200})
  res.send({data: text, status: 200})
  // console.log(text);

})






app.get('/',(req,res)=>{
    return res.json("Server is running")
})

// Show All User Info
app.get("/user_info",(req,res)=>{
   const sql = "SELECT * FROM user_info";
   db.query(sql,(err,data)=>{
    if(err){
        console.error("error " + err.stack)
        return res.json("Error occurs")
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
app.get('/package_details/:p_id',(req,res)=>{
    const p_id = req.params.p_id;
    const query = 'SELECT * FROM package WHERE p_id = ?';
    db.query(query, [p_id], (err, result) => {
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
app.post('/user_info', async(req,res)=>{

  const salt = await bcrypt.genSalt(10)
  const secPass = await bcrypt.hash(req.body.password , salt) 
    const newUser = req.body;
        const name =  req.body.name
        const email = req.body.email
        const number = req.body.number
        const gender = req.body.gender
        const role = req.body.role
        const password = secPass
        
    console.log(newUser)
    // newUser.id = user_info.length + 1;

      db.query ("INSERT INTO user_info (name,email,number,gender,role,password) VALUES(?,?,?,?,?,?)",[name,email,number,gender,role,password]),
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
        const name =  req.body.name
        const a_id = req.body.a_id
        const g_id = req.body.g_id
        const category = req.body.category
        const season = req.body.season
        const duration = req.body.duration
        const cost = req.body.cost
        const location = req.body.location
        const description = req.body.description
        const emergency = req.body.emergency
        const photo = req.body.photo
        
    console.log(newPackage)

      db.query ("INSERT INTO package (name,description,a_id,g_id,category,season,duration,cost,location,emergency,photo) VALUES(?,?,?,?,?,?,?,?,?,?,?)",[name,description,a_id,g_id,category,season,duration,cost,location,emergency,photo]),
        (err,result)=>{
            if(result){
                res.send(result)
            }
            else{
                res.send(err)
            }
        }
})


// Delete Single package
app.delete('/delete_package/:p_id', (req, res) => {
    const id = req.params.p_id;
  
    const query = 'DELETE FROM package WHERE p_id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Error deleting data:', err);
        res.status(500).json({ error: 'Failed to delete package' });
      }
      else {
        if (result.affectedRows > 0) {
          res.json({ deletedCount: result.affectedRows });
        } else {
          res.status(404).json({ error: 'Package not found' });
        }
      }
    });
  });


// Delete Single user
app.delete('/user_info/:id', (req, res) => {
    const id = req.params.id;
  
    const query = 'DELETE FROM user_info WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        console.error('Error deleting data:', err);
        res.status(500).json({ error: 'Failed to delete package' });
      }
      else {
        if (result.affectedRows > 0) {
          res.json({ deletedCount: result.affectedRows });
        } else {
          res.status(404).json({ error: 'user not found' });
        }
      }
    });
  });

// Update Packages
app.get('/update_package/:p_id',(req,res)=>{
    const id = req.params.p_id;
    const query = 'SELECT * FROM package WHERE p_id = ?';
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

app.put('/updated_package/:p_id',async(req, res) => {
    const id = req.params.p_id;
    const updatedPackage = req.body;
    console.log(updatedPackage)
    const { name,a_id,g_id,category,season,duration,cost,location,description,emergency,photo } = req.body;
  
    const query = 'UPDATE package SET name = ?, a_id=?, g_id=?, category=?, season=?, duration=?, cost=?, location=?, description = ?, emergency=?, photo=?  WHERE p_id = ?';
    db.query(query, [name,a_id,g_id,category,season,duration,cost,location,description,emergency,photo,id], (err, result) => {
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



  // Search
  app.post('/search', (req, res) => {
    const {season} = req.body;
  
    const query = 'SELECT * FROM package WHERE season = ?';
    db.query(query, [season], (err, results) => {
      if (err) {
        console.error('Error searching data:', err);
        res.status(500).json({ error: 'Search failed' });
      } else {
        res.json(results);
      }
    });
  });




app.listen(5000,()=>{
    console.log(`Server in running on port ${port}`)
})
