const Address = require('../models/Address');
const ErrorResponse = require('../utils/errorResponse');

exports.getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ userId: req.user.id })
      .sort({ isDefault: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: addresses
    });
  } catch (error) {
    next(error);
  }
};

exports.addAddress = async (req, res, next) => {
  try {
    const {
      fullName,
      phone,
      street,
      city,
      state,
      postalCode,
      country,
      isDefault = false
    } = req.body;

    const address = await Address.create({
      userId: req.user.id,
      fullName,
      phone,
      street,
      city,
      state,
      postalCode,
      country,
      isDefault
    });

    res.status(201).json({
      success: true,
      data: address
    });
  } catch (error) {
    next(error);
  }
};

exports.updateAddress = async (req, res, next) => {
  try {
    const {
      fullName,
      phone,
      street,
      city,
      state,
      postalCode,
      country,
      isDefault
    } = req.body;

    let address = await Address.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!address) {
      return next(new ErrorResponse('Address not found', 404));
    }

    const updateData = {
      fullName,
      phone,
      street,
      city,
      state,
      postalCode,
      country
    };

    if (typeof isDefault === 'boolean') {
      updateData.isDefault = isDefault;
    }

    address = await Address.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: address
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!address) {
      return next(new ErrorResponse('Address not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
