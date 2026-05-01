
export const PHONE_VALIDATION = {
    MAX_LENGTH: 10,
    ALLOW_LEADING_ZERO: false,
    PATTERN: /^\d*$/
};

export const isValidPhoneNumber = (phoneNumber) => {
    return (
        PHONE_VALIDATION.PATTERN.test(phoneNumber) &&
        phoneNumber.length <= PHONE_VALIDATION.MAX_LENGTH &&
        (phoneNumber === "" ||
            !PHONE_VALIDATION.ALLOW_LEADING_ZERO ||
            !phoneNumber.startsWith("0") ||
            phoneNumber.length > 1)
    );
};
export const validateAndSetPhoneNumber = (newPhoneNumber, setPhoneNumber) => {
    if (isValidPhoneNumber(newPhoneNumber)) {
        setPhoneNumber(newPhoneNumber);
        return true;
    }
    return false;
};

export const createPhoneNumberHandler = (setPhoneNumber) => {
    return (e) => {
        validateAndSetPhoneNumber(e.target.value, setPhoneNumber);
    };
};

export const formatPhoneNumber = (phoneNumber, countryCode = "") => {
    if (!phoneNumber) return "";
    return countryCode ? `${countryCode} ${phoneNumber}` : phoneNumber;
};