import { useState, useEffect } from 'react';
import {
    Box, Typography, Card, CardContent, Grid, CircularProgress,
    Alert, Chip, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Collapse, IconButton, Paper
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { BASE_URL } from '../../config/api.config';
import { regenAccessTokenApi } from '../../api/user.api';

const fetchIncomeHistory = async () => {
    let res = await fetch(`${BASE_URL}/v1/planpurchase/income/my-history`, { credentials: 'include' });
    if (res.status === 401) {
        await regenAccessTokenApi();
        res = await fetch(`${BASE_URL}/v1/planpurchase/income/my-history`, { credentials: 'include' });
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch income history');
    return data.data;
};

function IncomeRow({ row }: { row: any }) {
    const [open, setOpen] = useState(false);
    const isBinary = row.type === 'BINARY';

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' }, bgcolor: open ? 'action.hover' : '' }}>
                <TableCell>
                    {row.contributors?.length > 0 && (
                        <IconButton size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    )}
                </TableCell>
                <TableCell>
                    <Chip
                        label={isBinary ? 'Binary' : 'Royalty'}
                        size="small"
                        sx={{
                            fontWeight: 700,
                            background: isBinary ? '#4CAF50' : '#FF9800',
                            color: 'white',
                        }}
                    />
                </TableCell>
                <TableCell>
                    <Typography variant="body2" fontWeight={600} color="success.main">
                        ₹{Number(row.netIncome).toFixed(2)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Gross: ₹{Number(row.grossIncome).toFixed(2)}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="body2" color="text.secondary">TDS: ₹{Number(row.tds).toFixed(2)}</Typography>
                    <Typography variant="body2" color="text.secondary">Admin: ₹{Number(row.adminCharges).toFixed(2)}</Typography>
                </TableCell>
                <TableCell>
                    {isBinary ? (
                        <Typography variant="body2" fontWeight={600}>{row.matchedBV} BV matched</Typography>
                    ) : (
                        <Typography variant="body2" color="text.secondary">—</Typography>
                    )}
                </TableCell>
                <TableCell>
                    <Typography variant="body2">{new Date(row.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</Typography>
                    <Typography variant="caption" color="text.secondary">{new Date(row.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</Typography>
                </TableCell>
            </TableRow>

            {row.contributors?.length > 0 && (
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ m: 2 }}>
                                <Typography variant="subtitle2" fontWeight={700} mb={1} color="text.secondary">
                                    {isBinary ? '📊 BV Contributors' : '👥 Referral Sources'}
                                </Typography>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><b>Member</b></TableCell>
                                            <TableCell><b>Member ID</b></TableCell>
                                            <TableCell><b>BV</b></TableCell>
                                            <TableCell><b>Leg</b></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.contributors.map((c: any, i: number) => (
                                            <TableRow key={i}>
                                                <TableCell>{c.name}</TableCell>
                                                <TableCell><Chip label={c.memberId} size="small" variant="outlined" /></TableCell>
                                                <TableCell><b>{c.bv}</b></TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={c.leg}
                                                        size="small"
                                                        color={c.leg?.toLowerCase() === 'left' ? 'primary' : 'secondary'}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
}

const SUMMARY_CARDS = (s: any) => [
    { label: 'Total Income', value: `₹${Number(s?.totalIncome || 0).toFixed(2)}`, color: '#4CAF50' },
    { label: 'Binary Income', value: `₹${Number(s?.totalBinaryIncome || 0).toFixed(2)}`, color: '#2196F3' },
    { label: 'Royalty Income', value: `₹${Number(s?.totalRoyaltyIncome || 0).toFixed(2)}`, color: '#FF9800' },
    { label: 'Total Matched BV', value: `${s?.matchedBV || 0}`, color: '#9C27B0' },
    { label: 'Left BV', value: `${s?.leftBV || 0}`, color: '#00BCD4' },
    { label: 'Right BV', value: `${s?.rightBV || 0}`, color: '#E91E63' },
    { label: 'Left Carry-fwd', value: `${s?.carryLeftBV || 0}`, color: '#607D8B' },
    { label: 'Right Carry-fwd', value: `${s?.carryRightBV || 0}`, color: '#795548' },
];

export default function IncomeHistory() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchIncomeHistory()
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Box p={4} display="flex" justifyContent="center"><CircularProgress /></Box>;

    const summary = data?.summary;
    const history: any[] = data?.history || [];

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, background: '#f4f6f9', minHeight: '100vh' }}>
            <Typography variant="h4" fontWeight={800} mb={3}>💰 Income History</Typography>

            {/* Summary cards */}
            <Grid container spacing={2} mb={4}>
                {SUMMARY_CARDS(summary).map((s) => (
                    <Grid key={s.label} size={{ xs: 6, sm: 4, md: 3 }}>
                        <Card sx={{ borderRadius: 3, textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
                            <CardContent sx={{ py: 2 }}>
                                <Typography variant="h6" fontWeight={800} sx={{ color: s.color }}>{s.value}</Typography>
                                <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Income history table */}
            {history.length === 0 ? (
                <Alert severity="info">No income records found yet. Income is generated when plan purchases are approved.</Alert>
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#f9fafb' }}>
                                <TableCell />
                                <TableCell><b>Type</b></TableCell>
                                <TableCell><b>Net Income</b></TableCell>
                                <TableCell><b>Deductions</b></TableCell>
                                <TableCell><b>BV Info</b></TableCell>
                                <TableCell><b>Date</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {history.map((row: any) => (
                                <IncomeRow key={`${row.type}-${row.id}`} row={row} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}
