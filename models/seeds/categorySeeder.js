const db = require('../../config/mongoose')
const Category = require('../category')
const categorySeed  = require('./categorySeeds.json').categorySeed

db.once('open', () => {
    Category.create(categorySeed)
        .then(() => {
            // db.close()
            console.log('categorySeed is created successfully')
            process.exit()
        })
        .catch(error => console.log(error))
})





