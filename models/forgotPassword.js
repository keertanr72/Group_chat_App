const { default: mongoose } = require('mongoose')

const Schema = require('mongoose').Schema

const forgotPasswordSchema = new Schema({
    forgotPasswordId: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

forgotPasswordSchema.statics.checkIsActive = async function() {
    
}

module.exports = mongoose.model('ForgotPassword', forgotPasswordSchema)





// const getDb = require('../util/database').getDb

// class ForgotPassword {
//     constructor(forgotPasswordId, isActive, userId) {
//         this.forgotPasswordId = forgotPasswordId
//         this.isActive = isActive
//         this.userId = userId
//     }

//     save() {
//         const db = getDb()

//         return db.collection('forgotPasswords').insertOne(this)
//             .then((result) => {
//                 // console.log(result)
//             }).catch((err) => {
//                 console.log(err)
//             });
//     }

//     static checkIsActive(forgotPasswordId) {
//         const db = getDb();
//         return db
//             .collection('forgotPasswords')
//             .find({ forgotPasswordId })
//             .toArray()
//             .then((result) => {
//                 // console.log(result[0])
//                 if (result[0].isActive) {
//                     return true
//                 } else {
//                     return false
//                 }
//             }).catch((err) => {
//                 console.log(err)
//             });
//     } 

//     static updateIsActive(forgotPasswordId) {
//         const db = getDb();
//         return db.collection('forgotPasswords')
//             .updateOne({ forgotPasswordId }, { $set: { isActive: false } })
//             .then(result => {
//                 // console.log(result);
//                 return result;
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }
// }

// module.exports = ForgotPassword