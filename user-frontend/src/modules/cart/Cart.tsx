import {
    Box,
    Typography,
    IconButton,
    Button,
    Container,
    Paper,
    useTheme,
    useMediaQuery,
    Stack,
    Dialog,
    DialogContent,
    CircularProgress
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import designConfig, { alpha } from "../../config/designConfig";
import { useCart, useUpdateCart, useRemoveFromCart } from "../../hooks/useEcommerce";

const Cart = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const { data: cartData, isLoading } = useCart();
    const items = cartData?.data || [];

    const { mutate: updateCart } = useUpdateCart();
    const { mutate: removeFromCart } = useRemoveFromCart();

    const total = items.reduce((acc: number, item: any) => acc + item.product.dp_amount * item.quantity, 0);
    const totalBV = items.reduce((acc: number, item: any) => acc + Math.floor(item.product.dp_amount / 10) * item.quantity, 0);

    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleIncrease = (item: any) => {
        updateCart({ productId: item.productId, quantity: item.quantity + 1 });
    };

    const handleDecrease = (item: any) => {
        if (item.quantity > 1) {
            updateCart({ productId: item.productId, quantity: item.quantity - 1 });
        }
    };

    const handleRemove = (id: number) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = () => {
        if (deleteId) {
            removeFromCart(deleteId);
            setDeleteId(null);
        }
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (items.length === 0) {
        return (
            <Container maxWidth="md" sx={{ py: 4, height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>Your Cart is Empty</Typography>
                <Button variant="contained" onClick={() => navigate("/category")} sx={{ mt: 2 }}>Start Shopping</Button>
            </Container>
        );
    }

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: designConfig.colors.background.light, pb: isMobile ? 22 : 4 }}>
            <Box sx={{ position: "sticky", top: 0, zIndex: 1100, bgcolor: "white", borderBottom: '1px solid #f0f0f0', p: 2 }}>
                <Typography variant="h5" fontWeight={700} color="primary">Shopping Cart</Typography>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 3 }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                    <Box flex={1}>
                        <Stack spacing={2}>
                            {items.map((item: any) => (
                                <Paper key={item.id} sx={{ p: 2, display: "flex", gap: 2, alignItems: "center" }}>
                                    <Box sx={{ width: 80, height: 80, flexShrink: 0 }}>
                                        <img src={item.product.productmainimage} alt={item.product.productName} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                    </Box>
                                    <Box flex={1}>
                                        <Typography variant="subtitle1" fontWeight={700}>{item.product.productName}</Typography>
                                        <Typography variant="h6" fontWeight={700}>₹{item.product.dp_amount}</Typography>
                                        <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                                            <IconButton size="small" onClick={() => handleDecrease(item)}><KeyboardArrowDownIcon /></IconButton>
                                            <Typography fontWeight={600}>{item.quantity}</Typography>
                                            <IconButton size="small" onClick={() => handleIncrease(item)}><KeyboardArrowUpIcon /></IconButton>
                                            <IconButton onClick={() => handleRemove(item.productId)} color="error"><DeleteOutlineIcon /></IconButton>
                                        </Stack>
                                    </Box>
                                </Paper>
                            ))}
                        </Stack>
                    </Box>

                    <Box width={{ xs: "100%", md: 360 }}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={700} mb={3}>Order Summary</Typography>
                            <Box display="flex" justifyContent="space-between" mb={2}>
                                <Typography>Total Amount</Typography>
                                <Typography fontWeight={700}>₹{total.toLocaleString()}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" mb={3}>
                                <Typography>Total BV</Typography>
                                <Typography fontWeight={700} color="primary">{totalBV}</Typography>
                            </Box>
                            <Button variant="contained" fullWidth size="large" onClick={() => navigate("/checkout")}>Checkout</Button>
                        </Paper>
                    </Box>
                </Stack>
            </Container>

            <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
                <DialogContent>
                    <Typography variant="h6" textAlign="center">Remove Item?</Typography>
                    <Stack direction="row" spacing={2} mt={3}>
                        <Button fullWidth onClick={() => setDeleteId(null)}>Cancel</Button>
                        <Button fullWidth variant="contained" color="error" onClick={handleConfirmDelete}>Remove</Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Cart;
