const db = require('../../config/mongoose')
const bcrypt = require('bcryptjs')
// load Mongoose model
const Category = require('../category')
const Record = require('../record.js')
const User = require('../user.js')

// JSON files loaded for *record and *user
const recordSeeds = require('./recordSeeds.json').recordSeed
const userSeeds = require('./userSeeds.json').userSeeds

db.once('open', () => {
    Promise.all(
        userSeeds.map(seedUser => {
        const {name, email, password} = seedUser
        return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => {
            console.log('Ready to crate User', {name, email, hash})
            return User.create({name, email, password: hash})
                    .catch(error => console.log('User.create',error))
        })
        .then(user => {
            //Objective: 在每筆record 上面加上category._id.
            //先從category 資料庫 找出 根據每比record 的 category.
            //******一定要用return Promise, 不然這程式不會停下來等database回應 =.= *********
            //1. 每筆record都有record.category, 所以先map recordSeed.
            //2. 根據record.category 去Category Model 尋找相對應的name
            //3. 把找出來的categoryItem._id 更新到該筆 record.categoryId
            return Promise.all(recordSeeds.map(recordSeed => {
                // console.log(recordSeed)
                const name = recordSeed.category
                return Category.findOne({name})
                    .then(categoryItem => {
                        // console.log(categoryItem, categoryItem._id)
                        recordSeed.categoryId = categoryItem._id
                        // console.log(recordSeed)
                    })
                    .catch(error => console.log('Category.findOne',error))
                    
            }))
            //Objective: 在每筆record 上面加上user._id. 
            //每一筆userSeed 都有紀錄personalRecord代表各個user的record.
            //1. 先把所有record根據personalRecord做filter.
            //2. 把filtered過的 record 加上本次map 後 + bcrypt處理 + User Model created 的 user._id 
            .then(() => {
                const userId = user._id
                // console.log(userId)
                // console.log(recordSeeds)
                const recordSeedFiltered = recordSeeds.filter(recordSeed => seedUser.personalRecord.includes(recordSeed.id))
                recordSeedFiltered.forEach(recordSeed => {recordSeed.userId = userId})
                return Record.create(recordSeedFiltered)
                    .catch(error => console.log('Record.create',error))
            })
            .catch(error => console.log('Promise.all:recordSeeds.map',error))

        })
        .catch(error => console.log('bcrypt',error))
    }))
    .then(() => {
        console.log('record created !!!')
        process.exit()
    })
    .catch(error => console.log('Promise.all:userSeeds.map',error))
})