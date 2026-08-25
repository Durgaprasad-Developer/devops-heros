const express = require('express');
const app = express();
const PORT = 3000;

app.get('/',(req,res)=>{
    res.send('Hellow from Dockerized Node.js App!')
})

app.listen(PORT, () =>{
    console.log(`Server is running on ${PORT}`)
})