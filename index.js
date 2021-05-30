const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'client/build')));

 





app.get('*', (req, res) => {
  res.send("<h1>hii this is Express</h1>");
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Expressis listing on ${port}`);