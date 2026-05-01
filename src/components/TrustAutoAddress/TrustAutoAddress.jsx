import { Email, WhatsApp } from '@mui/icons-material';
import { FaGlobe } from 'react-icons/fa';
import { useGetCompanyProfileQuery } from '../../redux/api/companyProfile';
import Loading from '../Loading/Loading';
import { useTenantDomain } from '../../hooks/useTenantDomain';

const TrustAutoAddress = () => {
  const { tenantDomain } = useTenantDomain();
  const { data: CompanyInfoData, isLoading } = useGetCompanyProfileQuery({
    tenantDomain,
  });
  if (isLoading) {
    return <Loading />
  }
  return (
    <div>
      <div className="space-y-2 ">
        <div className="flex items-center ">
          <FaGlobe className="text-[#42A1DA]" />
          <p className="font-bold  ml-1 text-[#4671A1] text-[15px] md:text-base">{CompanyInfoData?.data?.website}</p>
        </div>
        <div className="flex items-center">
          <Email className="text-[#42A1DA]" />
          <p className="font-bold ml-1 text-[#4671A1] text-[15px] md:text-base">{CompanyInfoData?.data?.email}</p>
        </div>
        <div className="flex items-center ">
          <WhatsApp className="text-[#42A1DA] size-5 " size={25} />
          <p className="font-bold ml-1 text-[#4671A1] text-[15px] md:text-base"> {CompanyInfoData?.data?.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default TrustAutoAddress;