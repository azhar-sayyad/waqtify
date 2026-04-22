const express = require('express')
const app = express()
const rootRouter = require('./src/routes/index')
const port = 3000

app.get('/api/v1', rootRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
