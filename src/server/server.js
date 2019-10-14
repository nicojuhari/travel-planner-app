const express = require('express')
const app = express()

app.use(express.static('dist'));

app.get('/', function (req, res) {
  res.sendFile('dist/index.html');
})
 
app.listen(3000, () => {
    console.log('The server is runing on http://localhost:3000');
})