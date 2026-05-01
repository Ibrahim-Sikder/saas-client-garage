
import { useLocation } from 'react-router-dom';
import DonationForm from './DonationForm';

const UpdateDonation = () => {
    const location = useLocation();
  const id = new URLSearchParams(location.search).get("id");
  return <DonationForm id={id}/>
};

export default UpdateDonation;