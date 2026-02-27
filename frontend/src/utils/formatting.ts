/**
 * Formatting utilities
 */

/**
 * Formats a number with thousand separators
 * @param value - The value to format
 * @returns Formatted string
 */
export const formatNumber = (value: any): string => {
    if (value === null || value === undefined) return '0.00';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0.00';
    return num.toFixed(2);
};

/**
 * Formats a number as currency (USD)
 * @param value - The value to format
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number): string => {
    return `$${formatNumber(value)}`;
};

/**
 * Formats a phone number for display
 * @param phone - The phone number to format
 * @returns Formatted phone number
 */
export const formatPhoneDisplay = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 9) {
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }

    if (cleaned.length === 10) {
        return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 9)}`;
    }

    return phone;
};
