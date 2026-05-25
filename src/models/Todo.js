const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    title: {
      type: String,
      required: [true, 'Todo title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    completed: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      lowercase: true,
      enum: {
        values: ['low', 'medium', 'high'],
        message: '{VALUE} is not a valid priority'
      },
      default: 'medium'
    }
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
    versionKey: false
  }
);

// Indexes to speed up sorting by priority, completion status, or creation date
todoSchema.index({ completed: 1, priority: 1 });

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
