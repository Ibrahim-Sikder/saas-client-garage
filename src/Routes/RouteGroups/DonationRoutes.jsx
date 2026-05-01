import Donation from "../../pages/Donation/Donation";
import DonationList from "../../pages/Donation/DonationList";
import UpdateDonation from "../../pages/Donation/UpdateDonation";

export const donationRoutes = [
  {
    path: "create-donation",
    element: <Donation />,
    action: "create",
  },
  {
    path: "donation-list",
    element: <DonationList />,
  },
  {
    path: "update-donation",
    element: <UpdateDonation />,
    action: "edit",
  },
];
