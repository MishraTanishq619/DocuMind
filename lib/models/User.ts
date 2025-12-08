import mongoose, { Schema, model, models } from 'mongoose'

const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  chats: { type: [Schema.Types.ObjectId], ref: 'Chat', default: [] },
  createdAt: { type: Date, default: () => new Date() },
})

const User = (models.User as mongoose.Model<any>) || model('User', UserSchema)

export default User
