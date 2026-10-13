export function validateProduct(product, changes = {}) {
  const errors = {};
  const current = { ...product, ...changes };

  if (!current.productName || !current.productName.trim()) {
    errors.productName = 'Product name is required';
  }
  if (!current.designCode || !current.designCode.trim()) {
    errors.designCode = 'Design code is required';
  }

  return errors;
}

export function validateAll(products, changeMap) {
  const errorMap = {};

  products.forEach((product) => {
    const changes = changeMap[product._id] || {};
    const errors = validateProduct(product, changes);
    if (Object.keys(errors).length > 0) {
      errorMap[product._id] = errors;
    }
  });

  return errorMap;
}
