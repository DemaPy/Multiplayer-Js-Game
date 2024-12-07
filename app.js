const express = require('express')
const app = express()
const port = 3000

// Read public folder in the project in order to get acces for scripts
// inside index.html file we have js exports
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
