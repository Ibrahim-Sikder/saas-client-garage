/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import VehicleDetailsModal from "../../pages/Customer/CustomerProfile/VehicleDetailsModal";
import { ACCOUNT_CONFIG } from "./AccountConfig";
import { CARD_TYPES } from "./CardTypes";
import ContactInfoCard from "./ContactInfo";
import DataCard from "./DataCard";

const DynamicAccount = ({ profileType = "customer", profileData, tenantDomain }) => {
    const [vehicleDetails, setVehicleDetails] = useState(false);
    const [getId, setGetId] = useState("");

    const config = ACCOUNT_CONFIG[profileType];
    if (!config) {
        throw new Error(`Invalid profile type: ${profileType}`);
    }
    CARD_TYPES.moneyReceipt.dataKey = config.moneyReceiptKey;
    const handVehicleDetailsOpen = (id) => {
        setVehicleDetails(true);
        setGetId(id);
    };

    const handleVehicleDetailsClose = () => setVehicleDetails(false);
    const getRecentItems = (dataKey, count = 2) => {
        const items = profileData?.data?.[dataKey] || [];
        if (items.length === 0) return Array(count).fill(null);

        return [...items]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, count);
    };
    const renderDataCard = (cardType) => {
        const cardConfig = CARD_TYPES[cardType];
        const recentItems = getRecentItems(cardConfig.dataKey);

        return (
            <DataCard
                cardType={cardType}
                cardConfig={cardConfig}
                recentItems={recentItems}
                onVehicleDetailsOpen={handVehicleDetailsOpen}
            />
        );
    };

    return (
        <>
            <div className="customerProfileWrap">
                <div className="justify-between gap-5 flex-col lg:flex-row mt-5 flex">
                    <ContactInfoCard profileData={profileData} config={config} />
                    {renderDataCard("vehicle")}
                </div>
                <div className="justify-between gap-5 flex-col lg:flex-row mt-5 flex">
                    {renderDataCard("jobCard")}
                    {renderDataCard("quotation")}
                </div>
                <div className="justify-between gap-5 flex-col lg:flex-row mt-5 flex">
                    {renderDataCard("invoice")}
                    {renderDataCard("moneyReceipt")}
                </div>
            </div>
            {vehicleDetails && (
                <VehicleDetailsModal
                    handVehicleDetailsOpen={handVehicleDetailsOpen}
                    handleVehicleDetailsClose={handleVehicleDetailsClose}
                    getId={getId}
                    tenantDomain={tenantDomain}
                />
            )}
        </>
    );
};

export default DynamicAccount;