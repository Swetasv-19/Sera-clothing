const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return next(new ErrorResponse('Old password and new password are required', 400));
    }

    if (newPassword.length < 6) {
      return next(new ErrorResponse('New password must be at least 6 characters long', 400));
    }

    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    const isMatch = await user.matchPassword(oldPassword);

    if (!isMatch) {
      return next(new ErrorResponse('Current password is incorrect', 400));
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePreferences = async (req, res, next) => {
  try {
    const { preferences } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    if (preferences && typeof preferences === 'object') {
      user.preferences = { ...user.preferences, ...preferences };
      await user.save();
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferences: user.preferences,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      return next(new ErrorResponse('Password is required to delete account', 400));
    }

    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Password is incorrect', 400));
    }

    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
