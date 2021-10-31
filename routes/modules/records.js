// 引用 Express 與 Express 路由器
const express = require('express')

const Category = require('../../models/category')
const Record = require('../../models/record')
const moment = require('moment')
const router = express.Router()

router.get('/new', (req, res) => {
    Category.find()
        .lean()
        .then(categories => {
            res.render('new', {categories})
        })
        .catch(error => reject(error))
})

router.get('/edit/:id', async (req, res) => {
    const _id = req.params.id
    let categories = await Category.find().lean()
    
    Record.findById(_id)
        .lean()
        .then(record => {
            record.date = moment(record.date).format('YYYY-MM-DD')
            const categoryId = record.categoryId
            let categoryName = ''
            categories.map(item => {
                if (String(item._id) === String(categoryId)){
                    // console.log(item)
                    categoryName = item.name
                }
            })
            res.render('edit', {record, categories, categoryName})

            // res.render('edit', {record, categories})

        })
})

router.post('/edit/:id', async (req, res) => {
    const userId = req.user._id
    const _id = req.params.id
    const { name, date, amount, categoryId } = req.body
    // const category = await Category.findById(categoryId).lean()
    // const icon = category.icon
    Record.findByIdAndUpdate(
            { _id, userId },
            { name, date, amount, categoryId }
        )
        .then(() => res.redirect('/'))
  })

router.post('/new', (req, res) => {
    const userId = req.user._id
    const { name, date, amount, categoryId } = req.body
    console.log(name, date, amount, categoryId)
    Record.create({ name, date, amount, categoryId, userId })
      .then(() => res.redirect('/'))
      .catch((err) => console.log(err))
  })

  router.post('/delete/:id', (req, res) => {
    const userId = req.user._id
    const _id = req.params.id
    Record.findOne({ _id, userId })
      .then((record) => record.remove())
      .then(() => res.redirect('/'))
      .catch((err) => console.log(err))
  })

// 匯出路由器
module.exports = router