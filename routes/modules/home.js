// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
const Category = require('../../models/category')
const Record = require('../../models/record')
const moment = require('moment')


// 設定首頁路由
router.get('/', async (req, res) => {
    
    const recordsPromise = async(userId, filteredCategoryId) => {
        return new Promise((resolve, reject) => {
            if (filteredCategoryId){
                Record.find({ userId, categoryId: filteredCategoryId})
                .lean()
                .then(records => {
                    resolve(records)
                })
                .catch(error => reject(error))
            }else{
                Record.find({ userId })
                .lean()
                .then(records => {
                    resolve(records)
                })
                .catch(error => reject(error))
            }
        })
    }

    let categoryPromise = new Promise((resolve, reject) => {
        Category.find()
            .lean()
            .then(categories => {
                resolve(categories)
            })
            .catch(error => reject(error))
    })

    const getIconFromCategoryThenUpdateRecord = async(record) => {
        return new Promise((resolve, reject) => {
            const categoryId = record.categoryId
            Category.findById(categoryId)
            .lean()
            .then(category => {
                // console.log('*record*', record, '*category*', category)
                record.icon = category.icon
                resolve(record)
            })
            .catch(error => reject(error))
        })
    }
    const updateRecords = async (records) => {
        return Promise.all(
            records.map(async (item) => 
                await getIconFromCategoryThenUpdateRecord(item)
        ))
    }

    const userId = req.user._id   // 變數設定
    const filteredCategoryId = req.query.filter
    let totalAmount = 0
    
    let records = filteredCategoryId? 
                await recordsPromise(userId, filteredCategoryId): await recordsPromise(userId)
    
    let categories = await categoryPromise
    updateRecords(records)
        .then(updatedRecords => {
            updatedRecords.map(record => {
                totalAmount += record.amount
                record.date = moment(record.date).format('YYYY-MM-DD')
            })
            return res.render('index', {records:updatedRecords, totalAmount, categories})
        })
})

// 匯出路由器
module.exports = router