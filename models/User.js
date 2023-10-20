const mongoose = require('mongoose')
const {model, Schema} =  mongoose

const UserSchema = new Schema({
	// email: {type: String, required: true, unique: true},
	// password: {type:String, required: true}
	email: String,
	password: String,
	tasks: [{
		conent: String,
		isDone: Boolean
	}]
})

const User = model('User', UserSchema)
module.exports = User


// const mongoose = require('mongoose');
// const Schema = mongoose.Schema

// const UserSchema = new Schema({
//     email: {
//         type: String,
//         required: [true, "Email is required"]
//     }, 
//     password: {
//         type: String,
//         required: [true, "Password is required"]
//     }
// })

// const UserModel = mongoose.model("user", UserSchema)
// module.exports = UserModel