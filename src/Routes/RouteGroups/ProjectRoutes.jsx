import RunningProject from "../../pages/Projects/RunningProject";
import CompletedProject from "../../pages/Projects/CompletedProject";

export const projectRoutes = [
  {
    path: "running-project",
    element: <RunningProject />,
  },
  {
    path: "complete-project",
    element: <CompletedProject />,
  },
];
