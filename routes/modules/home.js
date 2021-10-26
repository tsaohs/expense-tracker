// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()


// 設定首頁路由
router.get('/', (req, res) => {
    console.log('home')
    res.render('index')
})

// 匯出路由器
module.exports = router