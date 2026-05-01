
import { useMemo } from 'react';

export const useProfileData = (profileType,) => {
    const config = useMemo(() => ({
        customer: {
            idKey: 'customerId',
            nameKey: 'customer_name',
            phoneKey: 'fullCustomerNum',
            displayName: 'Customer ID'
        },
        showroom: {
            idKey: 'showRoomId',
            nameKey: 'company_name',
            phoneKey: 'fullCompanyNum',
            displayName: 'Company ID'
        },
        company: {
            idKey: 'companyId',
            nameKey: 'company_name',
            phoneKey: 'fullCompanyNum',
            displayName: 'Company ID'
        }
    }), []);

    return config[profileType] || config.customer;
};