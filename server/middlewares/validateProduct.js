import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({ 'any.required': 'Product name is required' }),
  description: Joi.string().required(),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required(),
  category: Joi.string().required(),
  subcategory: Joi.string().optional(),
  brand: Joi.string().optional(),
  discount: Joi.object({
    isDiscounted: Joi.boolean(),
    discountPercent: Joi.number().min(0).max(100),
  }).optional(),
  flashSale: Joi.object({
    isFlashSale: Joi.boolean(),
    flashSalePrice: Joi.number().positive(),
    flashSaleEndTime: Joi.date(),
  }).optional(),
});

export const validateCreateProduct = (req, res, next) => {
  const { error } = createProductSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map((err) => err.message),
    });
  }
  next();
};
