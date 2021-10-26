// 載入 express 並建構應用程式伺服器
const express = require('express')
//express-handlebars
const exphbs = require('express-handlebars')

const app = express()
// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//use mongoDB
require('./config/mongoose')

const routes = require('./routes/index')

// 將 request 導入路由器
app.use(routes)

// 設定 port 3000
app.listen(3000, () => {
  console.log('Expense tracker is running on http://localhost:3000')
})