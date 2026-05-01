/* eslint-disable react/prop-types */
import {
  alpha,
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

export default function SummaryCards({ cards, singleRow }) {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cards.map((card, index) => (
        <Grid
          item
          xs={singleRow ? 12 / cards.length : 12}
          sm={singleRow ? 12 / cards.length : 6}
          md={singleRow ? 12 / cards.length : 3}
          key={index}
        >
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: `0 6px 16px ${alpha(card.color, 0.15)}`,
              background: `linear-gradient(135deg, ${alpha(
                card.bgColor,
                0.2
              )}, ${alpha(card.color, 0.05)})`,
              border: `1px solid ${alpha(card.color, 0.1)}`,
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box>
                  <Typography
                    color="text.secondary"
                    variant="body2"
                    sx={{ mb: 1 }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: card.color }}
                  >
                    {card.value}
                  </Typography>
                  {card.subtitle && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {card.subtitle}
                    </Typography>
                  )}
                </Box>
                {card.icon && (
                  <Avatar
                    sx={{
                      bgcolor: alpha(card.color, 0.2),
                      color: card.color,
                      width: 56,
                      height: 56,
                    }}
                  >
                    {card.icon}
                  </Avatar>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
