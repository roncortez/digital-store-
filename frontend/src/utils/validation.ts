/**
 * Validation utilities
 * All error messages in Spanish for UX
 */

/**
 * Validates an Ecuadorian ID (cédula)
 * @param cedula - The ID number to validate
 * @returns true if valid, false otherwise
 */
export const validateEcuadorianID = (cedula: string): boolean => {
    if (cedula.length !== 10) return false;

    const digits = cedula.split('').map(Number);
    const provinceCode = parseInt(cedula.substring(0, 2));

    if (provinceCode < 1 || provinceCode > 24) return false;

    const thirdDigit = digits[2];
    if (thirdDigit >= 6) return false;

    const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let sum = 0;

    for (let i = 0; i < 9; i++) {
        let product = digits[i] * coefficients[i];
        if (product >= 10) product -= 9;
        sum += product;
    }

    const verifier = sum % 10 === 0 ? 0 : 10 - (sum % 10);
    return verifier === digits[9];
};

/**
 * Validates an email address
 * @param email - The email to validate
 * @returns true if valid, false otherwise
 */
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validates a phone number (Ecuadorian format)
 * @param phone - The phone number to validate
 * @returns true if valid, false otherwise
 */
export const validatePhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length === 9 || cleanPhone.length === 10;
};

/**
 * Validates an Ecuadorian RUC (company tax ID)
 * @param ruc - The RUC to validate
 * @returns true if valid, false otherwise
 */
export const validateRUC = (ruc: string): boolean => {
    if (ruc.length !== 13) return false;

    const thirdDigit = parseInt(ruc.charAt(2));

    // RUC de persona natural (third digit < 6)
    if (thirdDigit < 6) {
        const cedula = ruc.substring(0, 10);
        return validateEcuadorianID(cedula);
    }

    // RUC de sociedad privada (third digit = 9)
    if (thirdDigit === 9) {
        const coefficients = [4, 3, 2, 7, 6, 5, 4, 3, 2];
        const digits = ruc.split('').map(Number);
        let sum = 0;

        for (let i = 0; i < 9; i++) {
            sum += digits[i] * coefficients[i];
        }

        const verifier = sum % 11 === 0 ? 0 : 11 - (sum % 11);
        return verifier === digits[9];
    }

    // RUC de empresa pública (third digit = 6)
    if (thirdDigit === 6) {
        const coefficients = [3, 2, 7, 6, 5, 4, 3, 2];
        const digits = ruc.split('').map(Number);
        let sum = 0;

        for (let i = 0; i < 8; i++) {
            sum += digits[i] * coefficients[i];
        }

        const verifier = sum % 11 === 0 ? 0 : 11 - (sum % 11);
        return verifier === digits[8];
    }

    return false;
};

/**
 * Validates a passport number
 * @param passport - The passport number to validate
 * @returns true if valid, false otherwise
 */
export const validatePassport = (passport: string): boolean => {
    // Passport should be 6-20 alphanumeric characters
    return passport.length >= 6 && passport.length <= 20 && /^[A-Z0-9]+$/.test(passport);
};
