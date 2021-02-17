const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

app.use(express.static(__dirname + '/'))

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))

app.listen(3000, () => console.log('Server running on port 3000'))