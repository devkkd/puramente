export function calculateDiff(original, current) {
  const diff = {};

  Object.keys(current).forEach((key) => {
    if (JSON.stringify(original[key]) !== JSON.stringify(current[key])) {
      diff[key] = current[key];
    }
  });

  return diff;
}

export function formatPayloadForApi(products, changes, originalValues) {
  const payload = {
    products: [],
  };

  products.forEach((product) => {
    if (changes[product._id] && Object.keys(changes[product._id]).length > 0) {
      const updates = {};
      Object.entries(changes[product._id]).forEach(([key, value]) => {
        if (originalValues[product._id][key] !== value) {
          updates[key] = value;
        }
      });

      if (Object.keys(updates).length > 0) {
        payload.products.push({
          _id: product._id,
          updates,
        });
      }
    }
  });

  return payload;
}
