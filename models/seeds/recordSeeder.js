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
    // userSeed.map(seedUser => {
    //     console.log(seedUser)
    // })
    
    
    Promise.all(
        userSeeds.map(seedUser => {
        const {name, email, password} = seedUser
        return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => {
            console.log('Ready to crate User', {name, email, hash})
            return User.create({name, email, password: hash})
        .catch(error => console.log(error))
        })
        .then(user => {
            // const userId = user._id

            return Promise.all(recordSeeds.map(recordSeed => {
                // console.log(recordSeed)
                const name = recordSeed.category
                return Category.findOne({name})
                    .then(categoryItem => {
                        // console.log(categoryItem, categoryItem._id)
                        recordSeed.categoryId = categoryItem._id
                        // console.log(recordSeed)
                    })
                    
            }))
            .then(() => {
                const userId = user._id
                console.log(userId)
                console.log(recordSeeds)
                const recordSeedFiltered = recordSeeds.filter(recordSeed => seedUser.record.includes(recordSeed.id))
                recordSeedFiltered.forEach(recordSeed => {recordSeed.userId = userId})
                return Record.create(recordSeedFiltered)
            })

            



            // return Category.find()
            //         .lean()
            //         .then(categories => {
            //             console.log(categories)
            //             // recordSeed.categoryId = categoryItem.name
            //         })
            //         .catch(err => console.log(err))   


            recordSeeds.forEach(recordSeed => {
                const name = recordSeed.category
                return Category.find()
                    .lean()
                    .then(categoryItem => {
                        console.log(categoryItem)
                    })
                    .catch(err => console.log(err))
            })

            // console.log(recordSeeds)
            // const recordSeedFiltered = recordSeeds.filter(recordSeed => seedUser.record.includes(recordSeed.id))
            // console.log(restaurants)
            // recordSeedFiltered.forEach(recordSeed => {recordSeed.userId = userId})
            // console.log(restaurants)
            // return Record.create(recordSeedFiltered)
        })
        .catch(error => console.log(error))
    }))
    .then(() => {
        console.log('record created !!!')
        process.exit()
    })
    .catch(err => console.log(err))
    
    
})