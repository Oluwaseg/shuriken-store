import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({ 'any.required': 'Product name is required' }),
  description: Joi.string().required(),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required(),
  images: Joi.array()
    .min(1)
    .items(
      Joi.object({
        url: Joi.string().uri().required(),
        public_id: Joi.string().required(),
      })
    )
    .optional(), // Allow images to be optional if you're handling uploads separately
  category: Joi.string().required(),
  subcategory: Joi.string().optional(),
  brand: Joi.string().optional(),
  bestSeller: Joi.boolean().optional(),
  discount: Joi.object({
    isDiscounted: Joi.boolean().required(),
    discountPercent: Joi.number().min(0).max(100).required(),
  }).optional(),
  flashSale: Joi.object({
    isFlashSale: Joi.boolean().required(),
    flashSalePrice: Joi.number().positive().optional().allow(0), // Allow zero as valid
    flashSaleEndTime: Joi.date().optional().allow(null), // Allow null explicitly
  }).optional(),
}).prefs({ convert: true, allowUnknown: true });

export const validateCreateProduct = (req, res, next) => {
  const transformedBody = {
    ...req.body,
    price: Number(req.body.price),
    stock: Number(req.body.stock),
    bestSeller: req.body.bestSeller === 'true',
    discount: {
      isDiscounted: req.body['discount.isDiscounted'] === 'true',
      discountPercent: Number(req.body['discount.discountPercent']),
    },
    flashSale: {
      isFlashSale: req.body['flashSale.isFlashSale'] === 'true',
      flashSalePrice: req.body['flashSale.flashSalePrice']
        ? Number(req.body['flashSale.flashSalePrice'])
        : 0,
      flashSaleEndTime: req.body['flashSale.flashSaleEndTime'] || null,
    },
  };

  delete transformedBody['discount.isDiscounted'];
  delete transformedBody['discount.discountPercent'];
  delete transformedBody['flashSale.isFlashSale'];
  delete transformedBody['flashSale.flashSalePrice'];
  delete transformedBody['flashSale.flashSaleEndTime'];

  req.body = transformedBody;
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

export const updateProductSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  price: Joi.number().positive().optional(),
  stock: Joi.number().integer().min(0).optional(),
  images: Joi.array()
    .items(
      Joi.alternatives().try(
        Joi.object({
          url: Joi.string().uri().required(),
          public_id: Joi.string().required(),
        }),
        Joi.string().uri()
      )
    )
    .optional(),

  category: Joi.string().optional(),
  subcategory: Joi.string().optional(),
  brand: Joi.string().optional(),
  bestSeller: Joi.boolean().optional(),
  discount: Joi.object({
    isDiscounted: Joi.boolean().required(),
    discountPercent: Joi.number().min(0).max(100).required(),
  }).optional(),
  flashSale: Joi.object({
    isFlashSale: Joi.boolean().required(),
    flashSalePrice: Joi.number().positive().optional().allow(0),
    flashSaleEndTime: Joi.date().optional().allow(null),
  }).optional(),
  remove_images: Joi.array().items(Joi.string().uri()).optional(),
}).prefs({ convert: true, allowUnknown: true }); // Allow unknown fields for flexibility

export const validateUpdateProduct = (req, res, next) => {
  // Transforming discount fields correctly
  const transformedBody = {
    ...req.body,
    bestSeller: req.body.bestSeller === 'true',
    discount: {
      isDiscounted: req.body['discount.isDiscounted'] === 'true',
      discountPercent: Number(req.body['discount.discountPercent']),
    },
    flashSale: {
      isFlashSale: req.body['flashSale.isFlashSale'] === 'true',
      flashSalePrice: req.body['flashSale.flashSalePrice']
        ? Number(req.body['flashSale.flashSalePrice'])
        : 0,
      flashSaleEndTime: req.body['flashSale.flashSaleEndTime'] || null,
    },
  };

  // Clean up old discount and flash sale fields
  delete transformedBody['discount.isDiscounted'];
  delete transformedBody['discount.discountPercent'];
  delete transformedBody['flashSale.isFlashSale'];
  delete transformedBody['flashSale.flashSalePrice'];
  delete transformedBody['flashSale.flashSaleEndTime'];

  req.body = transformedBody;

  // Validation
  const { error } = updateProductSchema.validate(req.body, {
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
