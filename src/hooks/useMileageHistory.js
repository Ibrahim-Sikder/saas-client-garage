import { useState, useEffect } from "react";

const useMileageHistory = (getDataWithChassisNo) => {
  const [currentMileage, setCurrentMileage] = useState("");
  const [mileageChanged, setMileageChanged] = useState(false);

  const handleMileageChange = (e) => {
    const newMileage = e.target.value === "" ? "" : Number(e.target.value);
    setCurrentMileage(newMileage);

    const lastMileage =
      getDataWithChassisNo?.mileageHistory?.slice(-1)[0]?.mileage;

    if (lastMileage && newMileage !== lastMileage) {
      setMileageChanged(true);
    } else if (!lastMileage && newMileage) {
      setMileageChanged(true);
    } else {
      setMileageChanged(false);
    }
  };

  const handleDeleteMileageEntry = (index) => {
    const updatedHistory = getDataWithChassisNo.mileageHistory.filter(
      (_, i) => i !== index
    );
    getDataWithChassisNo.mileageHistory = updatedHistory;
  };

  useEffect(() => {
    const lastMileage =
      getDataWithChassisNo?.mileageHistory?.length > 0
        ? getDataWithChassisNo.mileageHistory[
            getDataWithChassisNo.mileageHistory.length - 1
          ].mileage
        : getDataWithChassisNo?.mileage || "";

    setCurrentMileage(lastMileage);
  }, [getDataWithChassisNo]);

  return {
    currentMileage,
    mileageChanged,
    handleMileageChange,
    handleDeleteMileageEntry,
  };
};

export default useMileageHistory;