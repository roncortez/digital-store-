/**
 * Phone number utilities
 */

export const PHONE_PREFIXES = [
    { value: '+593', label: 'Ecuador (+593)' },
    { value: '+1', label: 'USA (+1)' },
    { value: '+52', label: 'México (+52)' },
    { value: '+57', label: 'Colombia (+57)' },
    { value: '+51', label: 'Perú (+51)' },
];

/**
 * Extracts the phone prefix from a full phone number
 * @param phone - Full phone number with prefix
 * @returns The prefix (e.g., "+593")
 */
export const extractPhonePrefix = (phone: string): string => {
    if (!phone) return '+593';

    const match = phone.match(/^\+\d{1,3}/);
    return match ? match[0] : '+593';
};

/**
 * Removes the prefix from a phone number
 * @param phone - Full phone number with prefix
 * @returns Phone number without prefix
 */
export const removePhonePrefix = (phone: string): string => {
    if (!phone) return '';
    return phone.replace(/^\+\d{1,3}\s?/, '');
};

/**
 * Combines prefix and phone number
 * @param prefix - Phone prefix (e.g., "+593")
 * @param phone - Phone number without prefix
 * @returns Full phone number
 */
export const combinePhoneNumber = (prefix: string, phone: string): string => {
    if (!phone) return '';
    return `${prefix}${phone}`;
};

/**
 * Cleans a phone number of all non-numeric characters except +
 * @param phone - Phone number to clean
 * @returns Cleaned phone number
 */
export const cleanPhoneNumber = (phone: string): string => {
    return phone.replace(/[^\d+]/g, '');
};
