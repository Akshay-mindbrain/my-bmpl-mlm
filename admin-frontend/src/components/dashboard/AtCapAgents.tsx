import { Paper, Typography, Box, LinearProgress } from "@mui/material";
import { GetDashboardData } from "../../hooks/Dashboard/getDashboardData";

interface PackageData {
  name: string;
  current: number;
  total: number;
  color: string;
}

export default function AtCapAgents() {

  const { data, isLoading, error } = GetDashboardData();

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error loading data</Typography>;
  }

  const dashboard = data?.data;

  const packages: PackageData[] = [
    {
      name: "IBO Package",
      current: dashboard?.iboPlans ?? 0,
      total: 100,
      color: "#2196f3",
    },
    {
      name: "Silver Package",
      current: dashboard?.silveribo ?? 0,
      total: 100,
      color: "#4caf50",
    },
    {
      name: "Gold Package",
      current: dashboard?.goldibo ?? 0,
      total: 100,
      color: "#ff9800",
    },
    {
      name: "Star Package",
      current: dashboard?.staribo ?? 0,
      total: 100,
      color: "#f44336",
    },
  ];

  return (
    <Paper
      sx={{
        p: { xs: 2, md: 3 },
        width: "100%",
        height: "100%",
        borderRadius: 1,
        boxShadow: 2,
      }}
    >
      <Typography
        variant="h6"
        fontWeight={600}
        mb={3}
        sx={{ fontSize: { xs: "16px", md: "20px" } }}
      >
        At-Cap Agents
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: { xs: 2, md: 3 },
        }}
      >
        {packages.map((pkg) => {
          const percentage = (pkg.current / pkg.total) * 100;

          return (
            <Box key={pkg.name}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{ fontSize: { xs: "13px", md: "14px" } }}
                >
                  {pkg.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "12px", md: "13px" } }}
                >
                  {pkg.current}/{pkg.total}
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                  height: { xs: 6, md: 8 },
                  borderRadius: 5,
                  backgroundColor: "#e0e0e0",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: pkg.color,
                    borderRadius: 5,
                  },
                }}
              />
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}