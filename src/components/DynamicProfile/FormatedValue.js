export const formatValue = (value, fieldConfig) => {
    if (!value && value !== 0) return "N/A";

    let formattedValue = value;

    if (fieldConfig.prefix) {
        formattedValue = `${fieldConfig.prefix}${value}`;
    }

    if (fieldConfig.formatter) {
        formattedValue = fieldConfig.formatter(value);
    }

    return formattedValue;
};