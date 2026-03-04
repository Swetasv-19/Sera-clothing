const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: [true, 'Please add full name'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please add phone number'],
    trim: true
  },
  street: {
    type: String,
    required: [true, 'Please add street address'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'Please add city'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'Please add state'],
    trim: true
  },
  postalCode: {
    type: String,
    required: [true, 'Please add postal code'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Please add country'],
    trim: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

addressSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

module.exports = mongoose.model('Address', addressSchema);
