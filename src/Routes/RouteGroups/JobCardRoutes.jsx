import AddJobCard from "../../pages/AddJobCard/AddJobCard";
import JobCardList from "../../pages/AddJobCard/JobCardList";
import UpdateJobCard from "../../pages/AddJobCard/UpdateJobCard";
import PreviewJobCard from "../../pages/AddJobCard/PreviewJobCard/PreviewJobCard";
import RecycleBinJobCardList from "../../pages/Recyclebin/RecycleBinJobCardList";

export const jobCardRoutes = [
  {
    path: "create-job-card",
    element: <AddJobCard />,
    action: "create",
  },
  {
    path: "jobcard-list",
    element: <JobCardList />,
  },
  {
    path: "update-jobcard",
    element: <UpdateJobCard />,
    action: "edit",
  },
  {
    path: "preview",
    element: <PreviewJobCard />,
  },
  {
    path: "recycle-bin-jobcard-list",
    element: <RecycleBinJobCardList />,
  },
];
