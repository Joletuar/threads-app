import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  // este id corresponde al que nos asigna clerk cuando nos registramos o logeamos, es diferente al de mongoose
  id: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: { type: String, required: true },
  image: { type: String },
  bio: { type: String },
  threads: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Thread',
    },
  ],
  onboarded: {
    type: Boolean,
    default: false,
  },
  communities: [{ type: Schema.Types.ObjectId, ref: 'Community' }],
});

const User = models.User || model('User', userSchema);

export default User;
