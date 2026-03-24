import { Box, Typography, Card, Stack, Button, Chip, Divider, CircularProgress, Pagination } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import designConfig from "../../config/designConfig";
import dayjs from "dayjs";
import PageHeader from "../../components/common/PageHeader";
import { useState } from "react";
import { useMyPayouts } from "../../hooks/useEcommerce";

const Payouts = () => {
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data: payoutsRes, isLoading } = useMyPayouts(page, limit);
    const payoutHistory = payoutsRes?.data?.data || [];
    const totalPages = payoutsRes?.data?.totalPages || 1;

    // Calculate total lifetime payout
    const totalLifetime = payoutHistory.reduce((acc: number, curr: any) => acc + Number(curr.netAmount), 0);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PAID":
            case "ACTIVE": return designConfig.colors.success.background;
            case "PENDING": return designConfig.colors.warning.background;
            case "FAILED": return designConfig.colors.error.background;
            default: return designConfig.colors.background.light;
        }
    };

    const getStatusTextColor = (status: string) => {
        switch (status) {
            case "PAID":
            case "ACTIVE": return designConfig.colors.success.main;
            case "PENDING": return designConfig.colors.warning.main;
            case "FAILED": return designConfig.colors.error.main;
            default: return designConfig.colors.text.secondary;
        }
    };

    return (
        <Box sx={{ pb: 4, bgcolor: designConfig.colors.background.light, minHeight: "100vh" }}>
            <PageHeader title="Payout History" />

            <Box sx={{ p: 3 }}>
                {/* Total Paid Out */}
                <Card sx={{
                    p: 3,
                    bgcolor: designConfig.colors.primary.main,
                    color: "#fff",
                    borderRadius: 3,
                    mb: 3,
                    boxShadow: designConfig.shadows.primary
                }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Box sx={{ bgcolor: "rgba(255,255,255,0.2)", p: 1.5, borderRadius: "12px" }}>
                            <AccountBalanceWalletIcon fontSize="large" />
                        </Box>
                        <Box>
                            <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>Total Life-time Payout</Typography>
                            <Typography variant="h4" fontWeight={800}>₹{totalLifetime.toLocaleString()}</Typography>
                        </Box>
                    </Stack>
                </Card>

                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, color: designConfig.colors.text.primary, ml: 0.5 }}>
                    Detailed Transactions
                </Typography>

                {isLoading ? (
                    <Box display="flex" justifyContent="center" py={5}><CircularProgress /></Box>
                ) : payoutHistory.length === 0 ? (
                    <Box textAlign="center" py={5}><Typography color="text.secondary">No payout history found.</Typography></Box>
                ) : (
                    <Stack spacing={2}>
                        {payoutHistory.map((item: any) => (
                            <Card key={item.id} sx={{
                                p: 2,
                                borderRadius: 3,
                                border: `1px solid ${designConfig.colors.background.border}`,
                                boxShadow: designConfig.shadows.sm,
                                bgcolor: "white"
                            }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Box>
                                        <Typography fontWeight={700} color={designConfig.colors.text.primary}>
                                            Cycle: {item.payout?.payoutCycle}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                            Ref: P-{item.payoutId}-{item.id}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={item.status === 'ACTIVE' ? 'PROCESSED' : item.status}
                                        size="small"
                                        sx={{
                                            bgcolor: getStatusColor(item.status),
                                            color: getStatusTextColor(item.status),
                                            fontWeight: 700,
                                            borderRadius: "6px",
                                            fontSize: "0.7rem",
                                        }}
                                    />
                                </Stack>

                                <Box sx={{ bgcolor: designConfig.colors.primary.light + "11", p: 1.5, borderRadius: 2, mb: 2, border: `1px solid ${designConfig.colors.primary.light}22` }}>
                                    <Typography variant="caption" color={designConfig.colors.primary.main} fontWeight={700}>Net Distributed Amount</Typography>
                                    <Typography variant="h6" color={designConfig.colors.primary.main} fontWeight={800}>₹ {Number(item.netAmount).toLocaleString()}</Typography>
                                </Box>

                                <Stack spacing={1.5} px={0.5}>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">Gross Total</Typography>
                                        <Typography variant="body2" fontWeight={700}>₹ {Number(item.totalAmount).toLocaleString()}</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2" color="error.main" fontSize={13}>TDS Deduction</Typography>
                                        <Typography variant="body2" color="error.main" fontWeight={600}>-₹{Number(item.tdsAmount).toFixed(2)}</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2" color="error.main" fontSize={13}>Admin Charges</Typography>
                                        <Typography variant="body2" color="error.main" fontWeight={600}>-₹{Number(item.adminCharges).toFixed(2)}</Typography>
                                    </Stack>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="caption" color="text.secondary">
                                        Generated on: {new Date(item.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Stack>
                            </Card>
                        ))}
                        
                        {totalPages > 1 && (
                            <Stack alignItems="center" mt={2}>
                                <Pagination count={totalPages} page={page} onChange={(_, val) => setPage(val)} size="small" color="primary" />
                            </Stack>
                        )}
                    </Stack>
                )}
            </Box>
        </Box>
    );
};

export default Payouts;
