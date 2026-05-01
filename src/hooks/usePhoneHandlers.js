import { createPhoneNumberHandler } from '@/utils/phoneValidation';

export const usePhoneHandlers = (setters) => {
    const {
        setPhoneNumber,
        setDriverPhoneNumber,
        setOwnerPhoneNumber
    } = setters;

    return {
        handlePhoneNumberChange: createPhoneNumberHandler(setPhoneNumber),
        handleDriverPhoneNumberChange: createPhoneNumberHandler(setDriverPhoneNumber),
        handleOwnerPhoneNumberChange: createPhoneNumberHandler(setOwnerPhoneNumber)
    };
};