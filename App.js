const express = require('express')
const app = express()
const port = 3000
const path = require("path") // For join the path.

app.use(express.urlencoded()); // Urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays. It recognize the input coming from the form-filling.

function resData() {
  req.body.coinName;
}
app.use('/public', express.static('public/')); // The app.use() function is used to mount the specified middleware function(s) like (express.static) at the path which is being specified like (/public).
 // "/public" - use this path for express.static('public') middleware function. Express can use "public" folder for every static files.

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



