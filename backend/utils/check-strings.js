const isSafeString = (input) => {
    const scriptPattern = /<script.*?>.*?<\/script>/gi;
    const jsPattern = /javascript:/gi;

    return !(scriptPattern.test(input) || jsPattern.test(input));
};

const checkContent = (fields) => {
    let isValid = false
    for (const field of fields) {
        if (!isSafeString(field)) {
            isValid = false
        }
    }
    return isValid
}

module.exports = checkContent