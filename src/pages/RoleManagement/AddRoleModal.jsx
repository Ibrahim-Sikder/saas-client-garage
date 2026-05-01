/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button, Grid } from "@mui/material";
import GarageModal from "../../components/Share/Modal/GarageModal";
import FormSelect from "../../components/form/Select";
import FormInput from "../../components/form/Input";
import GarageForm from "../../components/form/Form";
import { useCreateRoleMutation, useUpdateRoleMutation } from "../../redux/api/roleApi";
import { toast } from "react-toastify";
import { useAppOptions } from "../../hooks/useAppOptions";
import { roleOptions } from "../../options";

const AddRoleModal = ({ open, onClose, roleData, isLoading }) => {
    const [createRole] = useCreateRoleMutation();
    const [updateRole] = useUpdateRoleMutation();
    const { performActionWithPermission, tenantDomain } = useAppOptions()
    const handleSubmit = async (data) => {
        performActionWithPermission('/dashboard/role-management', 'create', async () => {

            try {
                let res;
                if (roleData) {
                    res = await updateRole({
                        id: roleData._id,
                        tenantDomain,
                        data,
                    }).unwrap();

                } else {
                    res = await createRole({
                        tenantDomain,
                        data,
                    }).unwrap();

                }

                if (res?.success) {
                    toast.success(`Role ${roleData ? "updated" : "created"} successfully`);
                    onClose();
                }
            } catch (error) {
                const apiError = error?.data || error;
                if (apiError?.errorSources?.length > 0) {
                    apiError.errorSources.forEach((source) => {
                        toast.error(`${source.path}: ${source.message}`);
                    });
                } else if (apiError?.message) {
                    toast.error(apiError.message);
                } else {
                    toast.error("Failed to save role");
                }
            }
        }, "You don't have permission to create a role")
    };

    const defaultValues = {
        name: roleData?.name || "",
        type: roleData?.type || "",
        createdBy: roleData?.createdBy || "",
        status: roleData?.status || "active",
        description: roleData?.description || "",
    }

    if (isLoading) {
        return <div>Loading............</div>
    }

    const title = `${roleData ? 'Update' : 'Create'} Role`


    return (
        <>
            {
                isLoading ? (<div>Loading............</div>) : (
                    <GarageModal
                        open={open}
                        setOpen={onClose}
                        title={title}
                        maxWidth="md"
                    >
                        <GarageForm onSubmit={handleSubmit} defaultValues={defaultValues}>
                            <Grid container spacing={3} padding={2}>
                                <Grid item xs={12} md={6}>
                                    <FormInput
                                        label="Role Name"
                                        variant="outlined"
                                        fullWidth
                                        name="name"
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <FormSelect
                                        name="type"
                                        label="Type"
                                        items={roleOptions}
                                        size="normal"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormInput
                                        label="Created By"
                                        fullWidth
                                        name="createdBy"
                                        size="normal"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <FormSelect
                                        name="status"
                                        label="Status"
                                        items={['active', 'inactive']}
                                        size="medium"

                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <FormInput
                                        label="Description"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        name="description"
                                        placeholder="Describe the purpose and responsibilities of this role..."
                                    />
                                </Grid>

                                <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
                                    <Button
                                        variant="outlined"
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                    >
                                        {roleData ? 'Update' : 'Create'}  Role
                                    </Button>
                                </Grid>
                            </Grid>
                        </GarageForm>
                    </GarageModal >
                )
            }

        </>


    );
};

export default AddRoleModal;
