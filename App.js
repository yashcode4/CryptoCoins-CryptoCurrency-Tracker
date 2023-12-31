const express = require('express')
const app = express()
const port = 3000
const path = require("path") // For join the path.

function resData() {
  req.body.coinName;
}

// Tell express static files located inside 'public' folder and join the path it with directory path.
app.use(express.static(path.join(__dirname, 'public')));

// get to the user.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html')); // For sending file, we have to join current directory to the views directory and send its "index.html" file.
  })
  // post from the user.
  app.post('/', (req, res) => {

    coinName = req.body.selectCoin; // request coinName (main.js) from the selectCoin (index.html). Needs urlencoded().
    // coinName = req.body["selectCoin"]; // if the method is "get".
    res.sendFile(path.join(__dirname, 'views', 'index.html')); // For sending file, we have to join current directory to the views directory and send its "index.html" file.
})

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})



