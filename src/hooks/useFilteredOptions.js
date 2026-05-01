import { vehicleName } from "../constant";

const useFilteredOptions = (selectedBrand, setSelectedBrand, setFilteredVehicles) => {
  const sortedVehicleName = vehicleName.sort((a, b) => {
    if (a.value < b.value) return -1;
    if (a.value > b.value) return 1;
    return 0;
  });

  const handleBrandChange = (event, newValue) => {
    setSelectedBrand(newValue);

    // Filter and sort the vehicles
    const filtered = sortedVehicleName
      ?.filter((vehicle) =>
        vehicle.label?.toLowerCase().includes(newValue?.toLowerCase())
      )
      .sort((a, b) => a.label.localeCompare(b.label));

    setFilteredVehicles(filtered);
  };

  return { sortedVehicleName, handleBrandChange };
};

export default useFilteredOptions;