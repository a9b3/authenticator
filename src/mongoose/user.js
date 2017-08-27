import mongoose from 'mongoose'

export const key = 'User'
export const schema = new mongoose.Schema({
  email: {
    type    : String,
    required: true,
  },
  password: {
    type    : String,
    required: true,
  },
  id: {
    type    : String,
    required: true,
  },
  facebook: {

  },
}, {
  timestamps: true,
})

function getModel() {
  let placeholder
  try {
    placeholder = mongoose.model(key)
  } catch (e) {
    placeholder = mongoose.model(key, schema)
  }
  return placeholder
}
export default getModel()
