const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
  {
    // THIS IS THE RELATIONSHIP LINK
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // This points to the 'User' model
    },
    company: {
      type: String,
      required: [true, 'Please add a company name'],
    },
    position: {
      type: String,
      required: [true, 'Please add a position'],
    },
    status: {
      type: String,
      enum: ['Applied', 'Interviewing', 'Offer', 'Rejected'], // Can ONLY be these 4 values
      default: 'Applied',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);