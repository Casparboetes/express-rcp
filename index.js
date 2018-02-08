const bodyParser = require('body-parser')
const express = require('express')
const { Recipe } = require('./models')


const PORT = process.env.PORT || 3030

let app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.get('/recipes', (req, res, next) => {
  Recipe.find()
  .sort({ createdAt: -1 }) // Newest recipe first
  .then((recipes) => res.json(recipes)) // Send data in JSON format
  .catch((error) => next(error)) // Forward any errors to error handler
})

app.get('/recipes/:id', (req, res, next) => {
  const id = req.params.id
  Recipe.findById(id)
    .then((recipe) => {
      if (!recipe) { return next() }
      res.json(recipe)
    })
    .catch((error) => next(error))
})

app.post('/recipes',  (req, res, next) => {
  let newRecipe = req.body
  Recipe.create(newRecipe)
    .then((recipe) => res.json(recipe))
    .catch((error) => next(error))
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    message: err.message,
    // only print full errors in development
    error: app.get('env') === 'development' ? err : {}
  })
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
