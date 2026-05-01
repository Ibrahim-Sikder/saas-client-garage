/* eslint-disable react/prop-types */
import {
    Box,
    Paper,
    Typography,
    Avatar,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    alpha,
    useTheme,

} from "@mui/material";
import dayjs from "dayjs";
export const AttendanceDetails = ({ selectedAttendance, open, onClose, calculateWorkingHours, getStatusChip }) => {
    const theme = useTheme();
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                <Typography variant="h6" fontWeight="bold">
                    Attendance Details
                </Typography>
            </DialogTitle>
            <DialogContent dividers>
                {selectedAttendance && (
                    <Box>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Avatar
                                sx={{
                                    width: 60,
                                    height: 60,
                                    backgroundColor: theme.palette.primary.main,
                                    fontSize: "1.5rem",
                                }}
                            >
                                {selectedAttendance.full_name?.charAt(0) || "E"}
                            </Avatar>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">
                                    {selectedAttendance.full_name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {selectedAttendance.employeeId} •{" "}
                                    {selectedAttendance.designation}
                                </Typography>
                            </Box>
                        </Box>

                        <Grid container spacing={2} mt={1}>
                            <Grid item xs={6}>
                                <Typography
                                    variant="body2"
                                    fontWeight="bold"
                                    color="text.secondary"
                                >
                                    Date
                                </Typography>
                                <Typography variant="body1">
                                    {dayjs(selectedAttendance.date, "DD-MM-YYYY").format(
                                        "MMM DD, YYYY"
                                    )}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography
                                    variant="body2"
                                    fontWeight="bold"
                                    color="text.secondary"
                                >
                                    Status
                                </Typography>
                                <Box mt={0.5}>{getStatusChip(selectedAttendance)}</Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography
                                    variant="body2"
                                    fontWeight="bold"
                                    color="text.secondary"
                                >
                                    In Time
                                </Typography>
                                <Typography variant="body1">
                                    {selectedAttendance.in_time || "N/A"}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography
                                    variant="body2"
                                    fontWeight="bold"
                                    color="text.secondary"
                                >
                                    Out Time
                                </Typography>
                                <Typography variant="body1">
                                    {selectedAttendance.out_time || "N/A"}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography
                                    variant="body2"
                                    fontWeight="bold"
                                    color="text.secondary"
                                >
                                    Working Hours
                                </Typography>
                                <Typography variant="body1">
                                    {calculateWorkingHours(
                                        selectedAttendance.in_time,
                                        selectedAttendance.out_time
                                    )}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography
                                    variant="body2"
                                    fontWeight="bold"
                                    color="text.secondary"
                                >
                                    Overtime
                                </Typography>
                                <Typography variant="body1">
                                    {selectedAttendance.overtime
                                        ? `${selectedAttendance.overtime} hours`
                                        : "N/A"}
                                </Typography>
                            </Grid>
                            {selectedAttendance.late_status && (
                                <Grid item xs={12}>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 1.5,
                                            bgcolor: alpha(theme.palette.warning.light, 0.2),
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            color="warning.main"
                                            fontWeight="bold"
                                        >
                                            Late Arrival
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}
