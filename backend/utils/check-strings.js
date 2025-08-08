const isSafeString = (input) => {
  const scriptPattern = /<script.*?>.*?<\/script>/gi;
  const jsPattern = /javascript:/gi;

  return !(scriptPattern.test(input) || jsPattern.test(input));
};

const checkContent = (fields) => {
<<<<<<< HEAD
  let isValid = false;
  for (const field of fields) {
    if (isSafeString(field)) {
      isValid = true;
=======
    let isValid = false
    for (const field of fields) {
        if (isSafeString(field)) {
            isValid = true
        }
>>>>>>> 9099cfef5b5b3526209596b3fd234a9a26e26de3
    }
  }
  return isValid;
};

module.exports = checkContent;
