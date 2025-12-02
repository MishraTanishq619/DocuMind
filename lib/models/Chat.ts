import mongoose, { Schema, model, models } from 'mongoose'

const ChatSchema = new Schema({
  title: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() },
  // optional file metadata attached to the chat (null by default)
  file: { type: Schema.Types.Mixed, default: null },
})

const Chat = (models.Chat as mongoose.Model<any>) || model('Chat', ChatSchema)

export default Chat
