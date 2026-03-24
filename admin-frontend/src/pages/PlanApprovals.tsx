import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { getPendingPlanPurchasesApi, approvePlanPurchaseApi } from "../api/planPurchase.api";
import { toast } from "sonner";

interface PendingPurchase {
  id: number;
  purchase_type: string;
  BV: number;
  plan_amount: number;
  status: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    mobile: string;
    memberId: string;
  };
  plan: {
    planName: string;
  };
}

const PlanApprovals: React.FC = () => {
  const [purchases, setPurchases] = useState<PendingPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<number | null>(null);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const data = await getPendingPlanPurchasesApi();
      setPurchases(data.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch pending purchases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      setApprovingId(id);
      await approvePlanPurchaseApi(id);
      toast.success("Purchase approved successfully and BV distributed");
      setPurchases((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to approve purchase");
    } finally {
      setApprovingId(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Plan Purchase Approvals
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {purchases.length === 0 ? (
        <Alert severity="info">No pending plan purchases found.</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: "12px", border: "1px solid #e0e7ff" }}>
          <Table>
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell>Member ID</TableCell>
                <TableCell>User Name</TableCell>
                <TableCell>Plan Name</TableCell>
                <TableCell>Purchase Type</TableCell>
                <TableCell>BV</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchases.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>{p.user.memberId}</TableCell>
                  <TableCell>{`${p.user.firstName} ${p.user.lastName}`}</TableCell>
                  <TableCell>{p.plan.planName}</TableCell>
                  <TableCell>
                    <Chip label={p.purchase_type} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell fontWeight={600}>{p.BV}</TableCell>
                  <TableCell>₹{p.plan_amount}</TableCell>
                  <TableCell>{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={() => handleApprove(p.id)}
                      disabled={approvingId === p.id}
                    >
                      {approvingId === p.id ? <CircularProgress size={20} /> : "Approve"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default PlanApprovals;
