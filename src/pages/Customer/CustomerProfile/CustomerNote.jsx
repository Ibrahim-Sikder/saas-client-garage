/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  // Grid,
  IconButton,
  TextField,
  Typography,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as NoteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import swal from "sweetalert";
// import { StyledCard } from "../../../utils";
// import { NoteDate, NoteHeader } from "../../../utils/customStyle";
import CreateNoteModal from "./CreateNoteModal";
import {
  useDeleteNoteMutation,
  useGetAllNotesQuery,
} from "../../../redux/api/noteApi";
// import { Masonry } from "@mui/lab";

const CustomerNote = ({ id, tenantDomain, companyId, showRoomId }) => {
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingNote, setEditingNote] = useState(null);

  const limit = 10;

  const {
    data: noteData,
    isLoading,
    isError,
    refetch,
  } = useGetAllNotesQuery({
    tenantDomain,
    limit,
    page: currentPage,
    searchTerm,
    isRecycled: false,
    customerId: id,
    companyId,
    showRoomId,
  });

  const [deleteNote] = useDeleteNoteMutation();

  const notes = noteData?.data?.notes || [];
  const totalNotes = noteData?.data?.meta?.total || 0;
  const totalPages = noteData?.data?.meta?.totalPage || 1;

  const handleDeleteNote = async (noteId) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: "You want to delete this note?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (willDelete) {
      try {
        await deleteNote({ tenantDomain, id: noteId }).unwrap();
        refetch();
        swal("Moved to Recycle bin!", "Note deleted successfully.", "success");
      } catch (error) {
        swal("Error", "An error occurred while deleting the note.", "error");
      }
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setOpenModal(true);
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setOpenModal(true);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" color="error">
          Failed to load notes. Please try again.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
       

        <Typography
  variant="h4"
  component="h1"
  sx={{
    color: "primary.main",
    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" }, // responsive sizes
    fontWeight: { xs: 400, sm: 700 },
  }}
>
  Customer Notes ({totalNotes})
</Typography>


        <Box sx={{ display: { sm: "flex" }, gap: 2 }}>
          <TextField
            variant="outlined"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" />,
              sx: { borderRadius: "12px" },
            }}
            sx={{ width: { xs: 280, sm: 300 } }}
          />
          <div className="flex justify-end mt-2">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleCreateNote}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                px: 3,
                py: 1.5,
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(63, 81, 181, 0.3)",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(63, 81, 181, 0.4)",
                },
              }}
            >
              Create Note
            </Button>
          </div>
        </Box>
      </Box>

      {/* Notes List */}
      {notes.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            backgroundColor: "background.paper",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          }}
        >
          <NoteIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" sx={{ color: "text.secondary", mb: 1 }}>
            No notes found
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
            {searchTerm
              ? "Try a different search term"
              : "Create your first note"}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateNote}
            sx={{ borderRadius: "12px", textTransform: "none" }}
          >
            Create Note
          </Button>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              width: "100%",
              maxWidth: "900px",
              mx: "auto",
              px: { xs: 0, sm: 3, md: 4 },
              py: 3,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {notes.map((note) => (
              <Box
                key={note._id}
                sx={{
                  width: "100%",
                  borderRadius: "16px",
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  borderLeft: "5px solid",
                  borderColor: "primary.main",
                  p: { xs: 1, sm: 3 },
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                  },
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1.5,
                  }}
                >
                  {/* Title Section */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      color: "text.primary",
                      fontSize: "1.05rem",
                    }}
                  >
                    <NoteIcon
                      sx={{ color: "primary.main", mr: 1, opacity: 0.8 }}
                    />
                    {note.title || "Untitled Note"}
                  </Typography>

                  {/* Top Right: Date + Actions */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.disabled",
                        fontStyle: "italic",
                        mr: 0.5,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {format(new Date(note.createdAt), "MMM dd, yyyy")}
                    </Typography>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditNote(note)}
                        sx={{ p: 0.5 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteNote(note._id)}
                        sx={{ p: 0.5 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Content */}
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6,
                    fontSize: "0.95rem",
                  }}
                >
                  {note.content}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box
              sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 1 }}
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "contained" : "outlined"}
                    onClick={() => setCurrentPage(page)}
                    sx={{ minWidth: 36 }}
                  >
                    {page}
                  </Button>
                )
              )}
            </Box>
          )}
        </>
      )}

      <CreateNoteModal
        tenantDomain={tenantDomain}
        id={id}
        open={openModal}
        setOpen={setOpenModal}
        onClose={() => {
          setOpenModal(false);
          setEditingNote(null);
          refetch();
        }}
        editingNote={editingNote}
      />

      <Divider sx={{ my: 4 }} />
    </Box>
  );
};

export default CustomerNote;
