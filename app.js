// 載入 express 並建構應用程式伺服器
const express = require('express')
//express-handlebars
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const usePassport = require('./config/passport')
const app = express()
// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))

//use mongoDB
require('./config/mongoose')
const routes = require('./routes/index')

app.use(session({
    secret: 'ThisIsMySecret',
    resave: false,
    saveUninitialized: true
  }))

usePassport(app)

app.use((req, res, next) => {
    // 你可以在這裡 console.log(req.user) 等資訊來觀察
    // console.log(req.user)
    res.locals.isAuthenticated = req.isAuthenticated()
    res.locals.user = req.user
    next()
  })
// 將 request 導入路由器
app.use(routes)

// 設定 port 3000
app.listen(3000, () => {
  console.log('Expense tracker is running on http://localhost:3000')
})