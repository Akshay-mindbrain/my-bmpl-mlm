import {
    Box,
    Typography,
    Paper,
    Button,
    Container,
    Stack,
    IconButton,
    Divider,
    CircularProgress
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import designConfig from "../../config/designConfig";
import { useCart, usePlaceOrder } from "../../hooks/useEcommerce";
import { toast } from "sonner";

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const { data: cartData, isLoading: isCartLoading } = useCart();
    const items = cartData?.data || [];
    
    const { mutate: placeOrder, isPending: isPlacing } = usePlaceOrder();

    const [selectedAddress, setSelectedAddress] = useState<any>(location.state?.selectedAddress || null);

    const subtotal = items.reduce((acc: number, item: any) => acc + item.product.dp_amount * item.quantity, 0);
    const totalBV = items.reduce((acc: number, item: any) => acc + Math.floor(item.product.dp_amount / 10) * item.quantity, 0);
    
    const deliveryCharge = subtotal >= 5000 ? 0 : 100;
    const totalAmount = subtotal + deliveryCharge;

    const handlePlaceOrder = () => {
        if (!selectedAddress) {
            toast.error("Please select a delivery address");
            return;
        }

        const orderData = {
            items: items.map((i: any) => ({
                productId: i.productId,
                quantity: i.quantity
            })),
            paymentMethod: "DP_WALLET",
            address: {
                name: selectedAddress.name,
                phone: selectedAddress.phone,
                addressLine: selectedAddress.addressLine,
                city: selectedAddress.city,
                state: selectedAddress.state,
                pincode: selectedAddress.pincode,
                country: "India"
            }
        };

        placeOrder(orderData, {
            onSuccess: (res) => {
                toast.success("Order placed successfully using DP Wallet");
                navigate("/order-success", { state: { order: res.data } });
            }
        });
    };

    if (isCartLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", pb: 12 }}>
            <Box sx={{ position: "sticky", top: 0, zIndex: 1100, bgcolor: "white", p: 2, borderBottom: '1px solid #e2e8f0' }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <IconButton onClick={() => navigate(-1)}><KeyboardArrowLeftIcon /></IconButton>
                    <Typography variant="h6" fontWeight={700}>Checkout</Typography>
                </Stack>
            </Box>

            <Container maxWidth="md" sx={{ mt: 3 }}>
                <Stack spacing={3}>
                    {/* Delivery Address */}
                    <Paper sx={{ p: 2, borderRadius: 3 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="subtitle1" fontWeight={700}>Delivery Address</Typography>
                            <Button size="small" onClick={() => navigate("/address-selection")}>Change</Button>
                        </Stack>
                        
                        {selectedAddress ? (
                            <Box display="flex" gap={2}>
                                <LocationOnIcon color="primary" />
                                <Box>
                                    <Typography fontWeight={600}>{selectedAddress.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedAddress.addressLine}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">Phone: {selectedAddress.phone}</Typography>
                                </Box>
                            </Box>
                        ) : (
                            <Button variant="outlined" fullWidth onClick={() => navigate("/address-selection")}>
                                Select Address
                            </Button>
                        )}
                    </Paper>

                    {/* Order Items */}
                    <Paper sx={{ p: 2, borderRadius: 3 }}>
                        <Typography variant="subtitle1" fontWeight={700} mb={2}>Order Items</Typography>
                        <Stack spacing={2}>
                            {items.map((item: any) => (
                                <Stack key={item.id} direction="row" spacing={2} alignItems="center">
                                    <Box sx={{ width: 50, height: 50, bgcolor: '#f1f5f9', p: 1, borderRadius: 1 }}>
                                        <img src={item.product.productmainimage} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </Box>
                                    <Box flex={1}>
                                        <Typography variant="body2" fontWeight={600}>{item.product.productName}</Typography>
                                        <Typography variant="caption" color="text.secondary">Qty: {item.quantity}</Typography>
                                    </Box>
                                    <Typography variant="body2" fontWeight={700}>₹{item.product.dp_amount * item.quantity}</Typography>
                                </Stack>
                            ))}
                        </Stack>
                    </Paper>

                    {/* Payment Method */}
                    <Paper sx={{ p: 2, borderRadius: 3, border: '2px solid', borderColor: 'primary.main', bgcolor: '#f0fdf4' }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <AccountBalanceWalletIcon color="primary" />
                            <Box>
                                <Typography fontWeight={700}>DP Wallet</Typography>
                                <Typography variant="caption" color="text.secondary">Amount will be deducted from your DP balance</Typography>
                            </Box>
                        </Stack>
                    </Paper>

                    {/* Price Summary */}
                    <Paper sx={{ p: 2, borderRadius: 3 }}>
                        <Typography variant="subtitle1" fontWeight={700} mb={2}>Price Details</Typography>
                        <Stack spacing={1.5}>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2">Subtotal</Typography>
                                <Typography variant="body2">₹{subtotal}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="body2">Delivery Charges</Typography>
                                <Typography variant="body2" color={deliveryCharge === 0 ? 'success.main' : 'text.primary'}>
                                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                                </Typography>
                            </Box>
                            <Divider />
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="subtitle1" fontWeight={700}>Total Amount</Typography>
                                <Typography variant="subtitle1" fontWeight={700}>₹{totalAmount}</Typography>
                            </Box>
                            <Box sx={{ bgcolor: 'primary.light', p: 1, borderRadius: 1, textAlign: 'center' }}>
                                <Typography variant="caption" fontWeight={700} color="primary.main">
                                    Total BV Earned: {totalBV}
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>

                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={handlePlaceOrder}
                        disabled={isPlacing || !selectedAddress}
                        endIcon={<ArrowForwardIcon />}
                        sx={{ py: 2, borderRadius: 3, fontWeight: 700 }}
                    >
                        {isPlacing ? <CircularProgress size={24} color="inherit" /> : `Pay ₹${totalAmount} via DP Wallet`}
                    </Button>
                </Stack>
            </Container>
        </Box>
    );
};

export default Checkout;
