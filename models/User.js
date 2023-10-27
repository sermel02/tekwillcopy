// const mongoose = require('mongoose')
// const {model, Schema} =  mongoose

// const UserSchema = new Schema({
// 	// email: {type: String, required: true, unique: true},
// 	// password: {type:String, required: true}
// 	email: String,
// 	password: String,
// 	tasks: [{
// 		conent: String,
// 		isDone: Boolean
// 	}]
// })

// const User = model('User', UserSchema)
// module.exports = User



const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  todoTasks: [{taskText: String}]
});

const User = mongoose.model('User', userSchema);

module.exports = User;