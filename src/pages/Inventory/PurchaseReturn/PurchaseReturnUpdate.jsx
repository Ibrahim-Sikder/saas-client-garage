import { useLocation } from 'react-router-dom';
import PurchaseReturnForm from './PurchaseReturnForm';

const PurchaseReturnUpdate = () => {
  const location = useLocation();
  const id = new URLSearchParams(location.search).get("id");
  return <PurchaseReturnForm id={id} />
};

export default PurchaseReturnUpdate;
