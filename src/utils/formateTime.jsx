import dayjs from "dayjs";

export const formatTime = (time) => (time ? dayjs(time).format("h:mmA") : "");
