const Todo = require('../models/Todo');

/**
 * @desc    Get all todos (supports filtering by priority/completion)
 * @route   GET /api/todos
 * @access  Public
 */
const getTodos = async (req, res, next) => {
  try {
    const { priority, completed } = req.query;
    const filter = {};

    // Filter by priority ('low', 'medium', 'high')
    if (priority) {
      filter.priority = priority.toLowerCase();
    }

    // Filter by completion ('true', 'false')
    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }

    // Retrieve todos, sorted by completed status (uncompleted first) and newest first
    const todos = await Todo.find(filter).sort({ completed: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single todo by ID
 * @route   GET /api/todos/:id
 * @access  Public
 */
const getTodoById = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      res.status(404);
      throw new Error(`Todo not found with id of ${req.params.id}`);
    }

    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new todo
 * @route   POST /api/todos
 * @access  Public
 */
const createTodo = async (req, res, next) => {
  try {
    const { title, description, priority, completed } = req.body;

    const todo = await Todo.create({
      title,
      description,
      priority,
      completed
    });

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: todo
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a todo (title, description, completed, priority)
 * @route   PUT /api/todos/:id
 * @access  Public
 */
const updateTodo = async (req, res, next) => {
  try {
    let todo = await Todo.findById(req.params.id);

    if (!todo) {
      res.status(404);
      throw new Error(`Todo not found with id of ${req.params.id}`);
    }

    // Update with body, enforce validator recheck
    todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: todo
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a todo
 * @route   DELETE /api/todos/:id
 * @access  Public
 */
const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      res.status(404);
      throw new Error(`Todo not found with id of ${req.params.id}`);
    }

    await Todo.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
};
