const express = require('express')
const path = require('path')

const PORT = 3000
let app = express()

app.use(express.static('public'))

app.get('*', (req, res, next) => {
  res.sendFile(path.resolve('public/index.html'))
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`)
})
