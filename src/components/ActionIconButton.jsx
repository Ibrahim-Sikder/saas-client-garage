/* eslint-disable react/prop-types */
"use client";
import { Tooltip, IconButton, Zoom, useTheme, alpha } from "@mui/material";


const ActionIconButton = ({
    title,
    colorVariant = "primary",
    onClick,
    icon,
    size = "small",
    disabled = false,
    sx = {},
}) => {
    const theme = useTheme();
    const mainColor = theme.palette[colorVariant].main;

    return (
        <Tooltip title={title} TransitionComponent={Zoom}>
            <span>

                <IconButton
                    size={size}
                    onClick={onClick}
                    disabled={disabled}
                    sx={{
                        color: mainColor,
                        backgroundColor: alpha(mainColor, 0.1),
                        "&:hover": {
                            backgroundColor: alpha(mainColor, 0.2),
                        },
                        mr: 1,
                        ...sx,
                    }}
                >
                    {icon}
                </IconButton>
            </span>
        </Tooltip>
    );
};

export default ActionIconButton;
