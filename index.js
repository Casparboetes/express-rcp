const bodyParser = require('body-parser')
const express = require('express')
const { recipes } = require('./routes')


const port = process.env.PORT || 3030

let app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

.use(recipes)

.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    message: err.message,
    // only print full errors in development
    error: app.get('env') === 'development' ? err : {}
  })
})

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
