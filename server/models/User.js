const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'faculty', 'admin', 'junior'],
    default: 'student'
  },
  profile: {
    firstName: String,
    lastName: String,
    studentId: String,
    avatar: String,
    department: String,
    year: Number,
    socialLinks: {
      github: String,
      linkedin: String,
      twitter: String
    }
  },
  academicInfo: {
    gpa: Number,
    attendance: Number,
    completedCourses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }],
    currentCourses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }]
  },
  achievements: [{
    title: String,
    description: String,
    date: Date,
    category: String,
    badge: String,
    isPublic: {
      type: Boolean,
      default: true
    }
  }],
  notifications: [{
    message: String,
    type: String,
    read: Boolean,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
