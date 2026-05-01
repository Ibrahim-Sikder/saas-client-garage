/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */

import {
  Box,
  Checkbox,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { DeleteIcon } from "lucide-react";
import { useState } from "react";

// ========== TASK CHECKLIST ITEM ==========
export const TaskChecklistItem = ({
  item,
  index,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(index, { ...item, text: editText.trim() });
      setEditing(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        p: 1,
        borderRadius: 1,
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <Checkbox
        checked={item.completed}
        onChange={() => onToggle(index)}
        size="small"
      />
      {editing ? (
        <TextField
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyPress={(e) => e.key === "Enter" && handleSave()}
          size="small"
          autoFocus
          fullWidth
        />
      ) : (
        <Typography
          sx={{
            flex: 1,
            textDecoration: item.completed ? "line-through" : "none",
            color: item.completed ? "text.disabled" : "text.primary",
            cursor: "pointer",
          }}
          onClick={() => setEditing(true)}
        >
          {item.text}
        </Typography>
      )}
      <IconButton size="small" onClick={() => onDelete(index)}>
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

// ========== UTILITY FUNCTIONS ==========
export const fixDateTimeFormat = (dateTimeString, isEndTime = false) => {
  try {
    if (!dateTimeString) return new Date().toISOString();

    if (dateTimeString.includes("Z")) {
      return dateTimeString;
    }

    if (dateTimeString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
      return dateTimeString + ":00.000Z";
    }

    if (dateTimeString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)) {
      return dateTimeString + ".000Z";
    }

    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    if (isEndTime) {
      return new Date(date.getTime() + 30 * 60000).toISOString();
    }

    return date.toISOString();
  } catch (error) {
    console.error("Date format error:", error);
    const now = new Date();
    if (isEndTime) {
      return new Date(now.getTime() + 60 * 60000).toISOString();
    }
    return now.toISOString();
  }
};

export const formatForDateTimeLocal = (date) => {
  const pad = (num) => num.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
