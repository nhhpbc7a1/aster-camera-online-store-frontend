/**
 * Format currency to Vietnamese Dong format
 * @param {number|string} amount - The amount to format
 * @param {boolean} showCurrency - Whether to show currency symbol (₫)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, showCurrency = true) => {
    // Convert to number if string
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    // Handle invalid numbers
    if (isNaN(numAmount)) {
        return showCurrency ? '0₫' : '0';
    }

    // Format with Vietnamese locale
    const formatted = numAmount.toLocaleString('vi-VN');

    return showCurrency ? `${formatted}₫` : formatted;
};

/**
 * Format currency with custom options
 * @param {number|string} amount - The amount to format
 * @param {object} options - Formatting options
 * @param {boolean} options.showCurrency - Whether to show currency symbol (₫)
 * @param {number} options.decimals - Number of decimal places
 * @returns {string} Formatted currency string
 */
export const formatCurrencyWithOptions = (amount, options = {}) => {
    const {
        showCurrency = true,
        decimals = 0
    } = options;

    // Convert to number if string
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    // Handle invalid numbers
    if (isNaN(numAmount)) {
        return showCurrency ? '0₫' : '0';
    }

    // Format with Vietnamese locale and decimals
    const formatted = numAmount.toLocaleString('vi-VN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });

    return showCurrency ? `${formatted}₫` : formatted;
};

/**
 * Parse currency string to number
 * @param {string} currencyString - Currency string to parse
 * @returns {number} Parsed number
 */
export const parseCurrency = (currencyString) => {
    if (typeof currencyString === 'number') {
        return currencyString;
    }

    // Remove currency symbol and dots, replace comma with dot
    const cleaned = currencyString
        .replace(/₫/g, '')
        .replace(/\./g, '')
        .replace(/,/g, '.')
        .trim();

    return parseFloat(cleaned) || 0;
};

/**
 * Calculate discount price
 * @param {number|string} price - Original price
 * @param {number|string} discount - Discount percentage (0-100)
 * @returns {number} Discounted price
 */
export const calculateDiscountPrice = (price, discount) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    const numDiscount = typeof discount === 'string' ? parseFloat(discount) : discount;

    if (isNaN(numPrice) || isNaN(numDiscount)) {
        return numPrice;
    }

    return numPrice - (numPrice * numDiscount / 100);
};

/**
 * Format price range
 * @param {number|string} minPrice - Minimum price
 * @param {number|string} maxPrice - Maximum price
 * @returns {string} Formatted price range
 */
export const formatPriceRange = (minPrice, maxPrice) => {
    return `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;
};
