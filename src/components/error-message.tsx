import { RxCross2 } from "react-icons/rx";
import React from "react";

interface MessageType {
  messages: { path: string; message: string }[];
}

export const ErrorMessage: React.FC<MessageType> = ({ messages }) => {
  if (!messages || messages?.length === 0) return null;

  return (
    <div className="bg-red-500/70 px-3 py-2 rounded-md flex flex-col items-center gap-x-2 text-sm text-white">
      <RxCross2 className="h-5 w-5" />
      <div className="flex flex-col items-start">
        {messages?.map((msg, index) => (
          <span key={index}>
            {index + 1} : {msg.message}
          </span>
        ))}
      </div>
    </div>
  );
};
