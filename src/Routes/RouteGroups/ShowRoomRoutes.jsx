import AddShowRoom from "../../pages/ShowRoom/AddShowRoom";
import UpdateShowRoom from "../../pages/ShowRoom/UpdateShowRoom";
import ShowRoomList from "../../pages/ShowRoom/ShowRoomList";
import ShowRoomProfile from "../../pages/ShowRoom/ShowRoomProfile";
import RecycledBinShowRoomList from "../../pages/Recyclebin/RecycledBinShowRoomList";

export const showroomRoutes = [
  {
    path: "add-show-room",
    element: <AddShowRoom />,
    action: "create",
  },
  {
    path: "update-show-room",
    element: <UpdateShowRoom />,
    action: "edit",
  },
  {
    path: "show-room-list",
    element: <ShowRoomList />,
  },
  {
    path: "show-room-profile",
    element: <ShowRoomProfile />,
  },
  {
    path: "recycle-bin-showroom-list",
    element: <RecycledBinShowRoomList />,
  },
];
