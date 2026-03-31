let mongoose = require('mongoose');
let roleSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, "name khong duoc trung"],
        required: [true, "name khong duoc rong"]
    },
    description: {
        type: String,
        default: ""
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})
module.exports = new mongoose.model(
    'role', roleSchema
)
