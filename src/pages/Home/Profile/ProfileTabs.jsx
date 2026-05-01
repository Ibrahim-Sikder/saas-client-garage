/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Chip, 
  CircularProgress, 
  Tab,
  Tabs
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

import {
  FaCheckCircle,
  FaCloudUploadAlt,
  FaEdit,
  FaCog,
  FaChartLine,
  FaCalendarAlt,
  FaUserCog,
  FaCrown,
  FaRocket,
  FaUserFriends,
  FaExclamationTriangle,
  FaShieldAlt,
  FaDatabase,
  FaGlobe,
  FaBuilding,
  FaCreditCard,
  FaHistory,
  FaTimes,
  FaMoneyBillWave,
  FaLock,
  FaUnlock,
} from "react-icons/fa";
import {
  Button,
  TextField,
  Avatar,
  Tooltip,
  Card,
  CardContent,
  Alert,
  Fade,
} from "@mui/material";
import { StyledPaper } from "../../../utils";

const ProfileTabs = ({ 
  activeTab, 
  handleTabChange,
  userData,
  tenantInfo,
  subscription,
  formatDate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Enhanced achievements based on user data
  const achievements = [
    {
      icon: <FaShieldAlt />,
      title: "Account Verified",
      description: `${userData.status} account status`,
      color: userData.status === "active" ? "#4CAF50" : "#FF9800",
      earned: userData.status === "active",
    },
    {
      icon: <FaDatabase />,
      title: "Database Connected",
      description: "MongoDB integration active",
      color: "#2196F3",
      earned: !!tenantInfo.dbUri,
    },
    {
      icon: <FaBuilding />,
      title: "Business Setup",
      description: `${tenantInfo.businessType} business type`,
      color: "#FF9800",
      earned: !!tenantInfo.businessType,
    },
    {
      icon: <FaMoneyBillWave />,
      title: "Payment Status",
      description: subscription.isPaid
        ? "Payment completed"
        : "Payment pending",
      color: subscription.isPaid ? "#4CAF50" : "#f44336",
      earned: subscription.isPaid,
    },
  ];

  // Enhanced recent activity
  const recentActivity = [
    {
      action: "Account created",
      date: formatDate(userData.createdAt),
      icon: <FaUserCog />,
      status: "completed",
    },
    {
      action: "Subscription activated",
      date: formatDate(subscription.startDate),
      icon: <FaCreditCard/>,
      status: subscription.isActive ? "active" : "expired",
    },
    {
      action: "Payment status",
      date: formatDate(subscription.startDate),
      icon: <FaMoneyBillWave />,
      status: subscription.isPaid ? "paid" : "pending",
    },
    {
      action: "Last profile update",
      date: formatDate(userData.updatedAt),
      icon: <FaHistory />,
      status: "completed",
    },
  ];

  const getActivityStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "active":
      case "paid":
        return "#4CAF50";
      case "expired":
      case "pending":
        return "#f44336";
      default:
        return "#FF9800";
    }
  };

  return (
    <StyledPaper sx={{p:1.5}}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        sx={{
          mb: 3,
          "& .MuiTab-root": {
            fontSize: "1.1rem",
            fontWeight: "600",
          },
        }}
      >
        <Tab label="Profile Details" />
        <Tab label="Achievements" />
        <Tab label="Recent Activity" />
      </Tabs>

      <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 0 && (
                  <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      Profile Information
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Paper
                            sx={{
                              p: 3,
                              borderRadius: "12px",
                              background:
                                "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                            }}
                          >
                            <Typography
                              variant="h6"
                              color="primary"
                              gutterBottom
                              className="flex items-center"
                            >
                              <FaUserCog style={{ marginRight: 8 }} />
                              Account Details
                            </Typography>
                            <Typography sx={{ mb: 1 }}>
                              {/* <strong>User ID:</strong> {userData?._id} */}
                            </Typography>
                            <Typography sx={{ mb: 1 }}>
                              <strong>Status:</strong>
                              <Chip
                                label={userData.status}
                                size="small"
                                sx={{
                                  ml: 1,
                                  bgcolor:
                                    userData.status === "active"
                                      ? "#4CAF50"
                                      : "#f44336",
                                  color: "white",
                                }}
                              />
                            </Typography>
                            <Typography sx={{ mb: 1 }}>
                              <strong>Role:</strong> {userData?.role}
                            </Typography>
                            <Typography sx={{ mb: 1 }}>
                              <strong>Created:</strong>{" "}
                              {formatDate(userData?.createdAt)}
                            </Typography>
                            <Typography>
                              <strong>Last Login:</strong>{" "}
                              {userData.lastLogin
                                ? formatDate(userData?.lastLogin)
                                : "Never"}
                            </Typography>
                          </Paper>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Paper
                            sx={{
                              p: 3,
                              borderRadius: "12px",
                              background:
                                "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
                            }}
                          >
                            <Typography
                              variant="h6"
                              color="primary"
                              gutterBottom
                            >
                              <FaBuilding style={{ marginRight: 8 }} />
                              Organization
                            </Typography>
                            <Typography sx={{ mb: 1 }}>
                              <strong>Name:</strong> {tenantInfo?.name}
                            </Typography>
                            <Typography sx={{ mb: 1 }}>
                              <strong>Domain:</strong> {tenantInfo?.domain}
                            </Typography>
                            <Typography sx={{ mb: 1 }}>
                              <strong>Type:</strong> {tenantInfo?.businessType}
                            </Typography>
                            <Typography sx={{ mb: 1 }}>
                              <strong>Active:</strong>
                              <Chip
                                label={tenantInfo.isActive ? "Yes" : "No"}
                                size="small"
                                sx={{
                                  ml: 1,
                                  bgcolor: tenantInfo?.isActive
                                    ? "#4CAF50"
                                    : "#f44336",
                                  color: "white",
                                }}
                              />
                            </Typography>
                            <Typography>
                              {/* <strong>Tenant ID:</strong> {userData.tenantId} */}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                  </Box>
                )}

                {activeTab === 1 && (
                  <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      Achievements & Badges
                    </Typography>
                    <Grid container spacing={3}>
                      {achievements.map((achievement, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Card
                              sx={{
                                height: "100%",
                                borderRadius: "16px",
                                background: achievement.earned
                                  ? `linear-gradient(135deg, ${achievement?.color}15, ${achievement?.color}05)`
                                  : "linear-gradient(135deg, #f5f5f5, #eeeeee)",
                                border: `2px solid ${
                                  achievement?.earned
                                    ? achievement?.color + "30"
                                    : "#e0e0e0"
                                }`,
                                transition: "all 0.3s ease",
                                opacity: achievement?.earned ? 1 : 0.6,
                                "&:hover": {
                                  transform: "translateY(-5px)",
                                  boxShadow: `0 10px 30px ${
                                    achievement.earned
                                      ? achievement?.color + "30"
                                      : "#00000020"
                                  }`,
                                },
                              }}
                            >
                              <CardContent sx={{ textAlign: "center", p: 3 }}>
                                <Box
                                  sx={{
                                    display: "inline-flex",
                                    p: 2,
                                    borderRadius: "50%",
                                    bgcolor: achievement?.earned
                                      ? achievement?.color
                                      : "#bdbdbd",
                                    color: "white",
                                    mb: 2,
                                  }}
                                >
                                  {React.cloneElement(achievement?.icon, {
                                    size: 24,
                                  })}
                                </Box>
                                <Typography
                                  variant="h6"
                                  fontWeight="bold"
                                  gutterBottom
                                >
                                  {achievement?.title}
                                  {achievement?.earned && (
                                    <FaCheckCircle
                                      style={{
                                        marginLeft: 8,
                                        color: "#4CAF50",
                                      }}
                                    />
                                  )}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {achievement.description}
                                </Typography>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {activeTab === 2 && (
                  <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      Recent Activity
                    </Typography>
                    {recentActivity.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Paper
                          sx={{
                            p: 3,
                            mb: 2,
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            transition: "all 0.3s ease",
                            borderLeft: `4px solid ${getActivityStatusColor(
                              activity?.status
                            )}`,
                            "&:hover": {
                              transform: "translateX(10px)",
                              boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 48,
                              height: 48,
                              borderRadius: "12px",
                              bgcolor: getActivityStatusColor(activity?.status),
                              color: "white",
                              mr: 3,
                            }}
                          >
                            {activity?.icon}
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" fontWeight="600">
                              {activity?.action}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {activity?.date}
                            </Typography>
                          </Box>
                          <Chip
                            label={activity?.status}
                            size="small"
                            sx={{
                              bgcolor: getActivityStatusColor(activity?.status),
                              color: "white",
                              fontWeight: "bold",
                            }}
                          />
                        </Paper>
                      </motion.div>
                    ))}
                  </Box>
                )}
              </motion.div>
            </AnimatePresence>
    </StyledPaper>
  );
};

const ProfileDetails = ({ userData, tenantInfo, isEditing, setIsEditing }) => {
  // Profile details content
};

const AchievementsTab = ({ achievements }) => {
  // Achievements content
};

const RecentActivityTab = ({ recentActivity, getActivityStatusColor }) => {
  // Recent activity content
};

export default ProfileTabs;