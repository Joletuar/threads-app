import { Schema, model, models } from 'mongoose';

const threadSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'UserModel',
      required: true,
    },
    community: { type: Schema.Types.ObjectId, ref: 'Community' },
    parentId: {
      type: String,
    },
    children: [
      {
        types: Schema.Types.ObjectId,
        ref: 'ThreadModel',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ThreadModel = models.ThreadModel && model('ThreadModel', threadSchema);

export default ThreadModel;
