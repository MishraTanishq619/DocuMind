import mongoose, { Schema, model, models } from 'mongoose'

const SharedChatSchema = new Schema({
  publicId: { type: String, required: true, unique: true, index: true },
  originalChatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
  snapshot: {
    title: { type: String, required: true },
    messages: { type: Schema.Types.Mixed, default: [] },
    file: { type: Schema.Types.Mixed, default: null },
  },
  // Track which users have consumed this share and which chat was created for them
  consumers: {
    type: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
        createdAt: { type: Date, default: () => new Date() },
      },
    ],
    default: [],
  },
  createdAt: { type: Date, default: () => new Date() },
})

const SharedChat = (models.SharedChat as mongoose.Model<any>) || model('SharedChat', SharedChatSchema)

export default SharedChat
