import { vehicleModels, vehicleName } from "./Vehicle.constant";

export const getFormattedDate = () => {
    const parsedDate = new Date();
    const day = parsedDate.getDate()?.toString().padStart(2, "0");
    const month = (parsedDate.getMonth() + 1)?.toString().padStart(2, "0");
    const year = parsedDate.getFullYear();
    return `${day}-${month}-${year}`;
};

export const filterVehiclesByBrand = (brand) => {
    const sortedVehicleName = vehicleName.sort((a, b) => {
        if (a.value < b.value) return -1;
        if (a.value > b.value) return 1;
        return 0;
    });

    return sortedVehicleName
        ?.filter((vehicle) =>
            vehicle.label?.toLowerCase().includes(brand?.toLowerCase())
        )
        .sort((a, b) => a.label.localeCompare(b.label));
};

export const filterVehicleModels = (inputValue) => {
    return vehicleModels.filter((option) =>
        option.label.toLowerCase().startsWith(inputValue.toLowerCase())
    );
};

export const getDefaultMileage = (vehicleData) => {
    return vehicleData?.mileageHistory?.length > 0
        ? vehicleData.mileageHistory[vehicleData.mileageHistory.length - 1].mileage
        : vehicleData?.mileage || "";
};