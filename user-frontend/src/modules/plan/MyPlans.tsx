import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    TextField,
    Stack,
    Divider,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip
} from '@mui/material';
import { sharePlanToDirect } from '../../api/plan.api';
import { getMyDirectsApi } from '../../api/user.api';
import { usePurchasesByUser } from '../../hooks/plan/usePurchasesByUser';
import { toast } from 'sonner';
import designConfig from '../../config/designConfig';

export default function MyPlans() {
    const { data: purchaseData, isLoading: isPurchasesLoading, refetch: refetchPurchases } = usePurchasesByUser();
    const [directs, setDirects] = useState<any[]>([]);
    const [isDirectsLoading, setIsDirectsLoading] = useState(false);
    const [sharing, setSharing] = useState(false);

    const [selectedShare, setSelectedShare] = useState<any>(null);
    const [selectedDirect, setSelectedDirect] = useState<string>('');
    const [openModal, setOpenModal] = useState(false);

    const hasFirstPurchase = purchaseData?.data?.purchases?.some(
        (p: any) => p.purchase_type === "FIRST_PURCHASE" && p.status === "APPROVED"
    );

    const eligibleDirects = directs.filter(d => {
        const purchases: any[] = d.planPurchases || [];
        const hasApprovedFirstPurchase = purchases.some(
            (pp: any) => pp.purchase_type === 'FIRST_PURCHASE' && pp.status === 'APPROVED'
        );
        return !hasApprovedFirstPurchase;
    });

    const [searchTerm, setSearchTerm] = useState('');
    const filteredDirects = eligibleDirects.filter(d =>
        (d.memberId && d.memberId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (`${d.firstName} ${d.lastName}`).toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        fetchDirects();
    }, []);

    const fetchDirects = async () => {
        setIsDirectsLoading(true);
        try {
            const res = await getMyDirectsApi();
            setDirects(res.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsDirectsLoading(false);
        }
    };

    const handleShareClick = (share: any) => {
        setSelectedShare(share);
        setOpenModal(true);
    };

    const handleConfirmShare = async () => {
        if (!selectedDirect) {
            toast.error("Please select a direct member");
            return;
        }

        setSharing(true);
        try {
            await sharePlanToDirect(selectedShare.id, Number(selectedDirect));
            toast.success("Plan shared successfully!");
            setOpenModal(false);
            setSelectedDirect('');
            refetchPurchases();
        } catch (error: any) {
            toast.error(error.message || "Failed to share plan");
        } finally {
            setSharing(false);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, background: "#f4f6f9", minHeight: "100vh" }}>
            <Typography variant="h4" fontWeight={800} mb={3}>
                📋 My Plans
            </Typography>

            <Box sx={{ mb: 3 }}>
                {hasFirstPurchase && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Your account is active.
                    </Alert>
                )}
            </Box>

            {isPurchasesLoading ? (
                <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
            ) : (purchaseData?.data?.purchases?.length === 0) ? (
                <Alert severity="info">You haven't purchased any plans yet.</Alert>
            ) : (
                <Grid container spacing={3}>
                    {purchaseData?.data?.purchases?.map((p: any) => (
                        <Grid item xs={12} md={6} lg={4} key={p.id}>
                            <Card sx={{
                                borderRadius: 3,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <Box sx={{
                                    p: 2,
                                    bgcolor: p.status === 'APPROVED' ? 'success.main' : 'warning.main',
                                    color: 'white',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <Typography variant="subtitle2" fontWeight={700}>
                                        {p.purchase_type.replace(/_/g, ' ')}
                                    </Typography>
                                    <Chip
                                        size="small"
                                        label={p.status}
                                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 700 }}
                                    />
                                </Box>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" fontWeight={800} mb={1}>
                                        {p.plan?.planName || "Plan Details"}
                                    </Typography>
                                    <Divider sx={{ my: 1.5 }} />
                                    <Stack spacing={1.5}>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="body2" color="text.secondary">Plan Amount</Typography>
                                            <Typography variant="body2" fontWeight={700}>₹{p.plan_amount}</Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="body2" color="text.secondary">DP Amount</Typography>
                                            <Typography variant="body2" fontWeight={700} color="primary.main">₹{p.dp_amount}</Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between">
                                            <Typography variant="body2" color="text.secondary">BV Points</Typography>
                                            <Typography variant="body2" fontWeight={700} color="secondary.main">{p.BV}</Typography>
                                        </Box>

                                        {p.plan?.features && (
                                            <Box mt={1}>
                                                <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mb={0.5}>
                                                    FEATURES:
                                                </Typography>
                                                <Stack direction="row" flexWrap="wrap" gap={0.5}>
                                                    {typeof p.plan.features === 'string'
                                                        ? JSON.parse(p.plan.features).map((f: string, i: number) => (
                                                            <Chip key={i} label={f} size="small" variant="outlined" />
                                                        ))
                                                        : Array.isArray(p.plan.features)
                                                            ? p.plan.features.map((f: string, i: number) => (
                                                                <Chip key={i} label={f} size="small" variant="outlined" />
                                                            ))
                                                            : null
                                                    }
                                                </Stack>
                                            </Box>
                                        )}

                                        <Divider sx={{ my: 1 }} />
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="caption" color="text.secondary">
                                                Purchased: {new Date(p.createdAt).toLocaleDateString()}
                                            </Typography>
                                            {p.purchase_type === "SHARE_PURCHASE" && (
                                                <Chip
                                                    size="small"
                                                    label={p.share_status}
                                                    color={p.share_status === 'AVAILABLE' ? "success" : "default"}
                                                    variant="outlined"
                                                />
                                            )}
                                        </Box>
                                    </Stack>
                                </CardContent>

                                {p.purchase_type === "SHARE_PURCHASE" && p.share_status === "AVAILABLE" && p.status === "APPROVED" && (
                                    <Box sx={{ p: 2, pt: 0 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            onClick={() => handleShareClick(p)}
                                            sx={{
                                                borderRadius: 2,
                                                fontWeight: 800,
                                                background: designConfig.colors.gradients.primary
                                            }}
                                        >
                                            Share to Direct
                                        </Button>
                                    </Box>
                                )}
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* SHARE MODAL */}
            <Dialog open={openModal} onClose={() => !sharing && setOpenModal(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 800 }}>Select Direct Member</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <Typography variant="body2">
                            Type the Member ID or Name to find your direct downline who doesn't have any plan yet.
                        </Typography>

                        <FormControl fullWidth>
                            <TextField
                                label="Search by Member ID or Name"
                                variant="outlined"
                                value={searchTerm}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                placeholder="e.g. USER-1002"
                            />
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel id="select-direct-label">Select Direct Member</InputLabel>
                            <Select
                                labelId="select-direct-label"
                                value={selectedDirect}
                                label="Select Direct Member"
                                onChange={(e) => setSelectedDirect(e.target.value)}
                                disabled={isDirectsLoading}
                            >
                                {isDirectsLoading ? (
                                    <MenuItem disabled><CircularProgress size={20} sx={{ mr: 1 }} /> Loading members...</MenuItem>
                                ) : directs.length === 0 ? (
                                    <MenuItem disabled>You have no direct members yet</MenuItem>
                                ) : filteredDirects.length === 0 ? (
                                    <MenuItem disabled>No eligible members found</MenuItem>
                                ) : (
                                    filteredDirects.map((d) => (
                                        <MenuItem key={d.id} value={d.id}>
                                            {d.firstName} {d.lastName} ({d.memberId})
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                            {directs.length > 0 && eligibleDirects.length === 0 && !isDirectsLoading && (
                                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                                    All your directs already have plans.
                                </Typography>
                            )}
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenModal(false)} disabled={sharing} color="inherit">Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleConfirmShare}
                        disabled={sharing || !selectedDirect}
                        sx={{ px: 3, fontWeight: 700 }}
                    >
                        {sharing ? <CircularProgress size={24} /> : "Confirm Share"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
