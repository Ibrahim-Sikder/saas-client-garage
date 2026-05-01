/* eslint-disable react/prop-types */
import { useDrop } from "react-dnd";
import { ItemTypes } from "../../constant/calendar";
export const DroppableCalendarSlot = ({ date, time, onDrop, children }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: [
      ItemTypes.EVENT,
      ItemTypes.TASK,
      ItemTypes.APPOINTMENT,
      ItemTypes.REMINDER,
    ],
    drop: (item, monitor) => {
      if (onDrop && monitor.didDrop()) {
        onDrop(item, { date, time });
      }
      return { date, time };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        backgroundColor: isOver ? "#e3f2fd" : "transparent",
        height: "100%",
        width: "100%",
        border: isOver ? "2px dashed #1976d2" : "1px solid #e0e0e0",
        position: "relative",
        transition: "all 0.2s ease",
      }}
    >
      {children}
    </div>
  );
};
