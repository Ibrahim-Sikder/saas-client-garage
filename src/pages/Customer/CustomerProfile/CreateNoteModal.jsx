/* eslint-disable react/prop-types */
import {

  Button,
  CircularProgress,
  Box,
} from "@mui/material";


import { toast } from "react-toastify";
import { CheckIcon } from "lucide-react";
import { useCreateNoteMutation, useUpdateNoteMutation } from "../../../redux/api/noteApi";
import GarageForm from "../../../components/form/Form";
import FormInput from "../../../components/form/Input";
import { buttonBox } from "../../../utils/customStyle";
import GarageModal from "../../../components/Share/Modal/GarageModal";

const CreateNoteModal = ({ id, open, onClose, tenantDomain, editingNote, setOpen }) => {
  const [createNote, { isLoading: isCreating }] = useCreateNoteMutation();
  const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();

  const isEditMode = Boolean(editingNote);

  const handleSubmit = async (data) => {
    const submitData = {
      ...data,
      customerId: id,
    };

    try {
      let res;
      if (isEditMode) {
        res = await updateNote({
          id: editingNote._id,
          tenantDomain,
          ...submitData,
        }).unwrap();
      } else {
        res = await createNote({ ...submitData, tenantDomain }).unwrap();
      }

      if (res.success) {
        toast.success(res.message || (isEditMode ? "Note updated!" : "Note created!"));
        onClose();
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };
  const title = `${id ? 'Edit' : 'Update'} Note`

  return (
    <GarageModal
      open={open}
      setOpen={setOpen}
      title={title}
      maxWidth="sm"
      
    >
      
      <GarageForm onSubmit={handleSubmit} defaultValues={editingNote || {}} >

        <FormInput
          fullWidth
          label="Note Title"
          name="title"
          margin="normal"
          variant="outlined"
          InputProps={{ sx: { borderRadius: "12px" } }}
        />

        <FormInput
          fullWidth
          multiline
          rows={4}
          label="Note Content"
          name="content"
          margin="normal"
          variant="outlined"
          InputProps={{ sx: { borderRadius: "12px" } }}
        />

        <Box sx={buttonBox}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ borderRadius: "12px", textTransform: "none", px: 3, py: 1 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            startIcon={!isCreating && !isUpdating && <CheckIcon />}
            disabled={isCreating || isUpdating}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              px: 3,
              py: 1,
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(63, 81, 181, 0.3)",
            }}
          >
            {isCreating || isUpdating ? (
              <CircularProgress size={20} color="inherit" />
            ) : isEditMode ? (
              "Update Note"
            ) : (
              "Create Note"
            )}
          </Button>
        </Box>
      </GarageForm>
    </GarageModal>
  );
};
export default CreateNoteModal;