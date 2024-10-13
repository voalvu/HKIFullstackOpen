const app = require('./app')

const config = require('./utils/config')

const PORT = config.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
