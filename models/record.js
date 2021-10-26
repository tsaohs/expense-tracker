const mongoose = require('mongoose')
const Schema = mongoose.Schema
const recordSchema = new Schema({
    id: {
        type: Number,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        require: true
    },
    userId: {  // 加入關聯設定
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
        required: true
    },
    categoryId: {  // 加入關聯設定
        type: Schema.Types.ObjectId,
        ref: 'Category',
        index: true,
        required: true
    }
})
module.exports = mongoose.model('Record', recordSchema)