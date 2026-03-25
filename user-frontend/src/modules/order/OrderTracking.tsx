import { useState } from 'react';
import { Box, Typography, Container, Paper, Stack, Button, IconButton, Divider, CircularProgress, Rating, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { useOrderDetails } from "../../hooks/useEcommerce";
import { addReviewApi } from "../../api/ecommerce.api";
import { toast } from "sonner";

const OrderTracking = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: orderData, isLoading } = useOrderDetails(Number(id));
    const order = orderData?.data;

    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    if (isLoading) {
        return <Box display="flex" justifyContent="center" py={10}><CircularProgress /></Box>;
    }

    if (!order) {
        return <Box p={4} textAlign="center"><Typography>Order not found</Typography></Box>;
    }

    const handleAddReview = async (productId: number) => {
        try {
            setIsSubmittingReview(true);
            await addReviewApi({
                productId,
                rating: reviewRating,
                comment: reviewComment
            });
            toast.success("Review submitted successfully");
            setReviewComment("");
        } catch (error: any) {
            toast.error(error.message || "Failed to submit review");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", pb: 10 }}>
            <Box sx={{ p: 2, bgcolor: "white", borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <IconButton onClick={() => navigate(-1)}><KeyboardArrowLeftIcon /></IconButton>
                    <Typography variant="h6" fontWeight={700}>Order Details</Typography>
                </Stack>
            </Box>

            <Container maxWidth="md" sx={{ mt: 2 }}>
                <Paper sx={{ p: 2, borderRadius: 3, mb: 3 }}>
                    <Stack direction="row" justifyContent="space-between" mb={2}>
                        <Box>
                            <Typography variant="caption" color="text.secondary">Order Number</Typography>
                            <Typography fontWeight={700}>{order.orderNumber}</Typography>
                        </Box>
                        <Box textAlign="right">
                            <Typography variant="caption" color="text.secondary">Status</Typography>
                            <Typography color="primary" fontWeight={700}>{order.orderStatus}</Typography>
                        </Box>
                    </Stack>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" fontWeight={700} mb={2}>Items</Typography>
                    <Stack spacing={2}>
                        {order.items?.map((item: any) => (
                            <Box key={item.id}>
                                <Stack direction="row" spacing={2}>
                                    <Box sx={{ width: 60, height: 60, bgcolor: '#f1f5f9', p: 1, borderRadius: 2 }}>
                                        <img src={item.product?.productmainimage} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                    </Box>
                                    <Box flex={1}>
                                        <Typography variant="body2" fontWeight={600}>{item.product?.productName}</Typography>
                                        <Typography variant="caption" color="text.secondary">Qty: {item.quantity} × ₹{item.dp_amount}</Typography>
                                    </Box>
                                    <Typography variant="subtitle2" fontWeight={700}>₹{item.quantity * item.dp_amount}</Typography>
                                </Stack>
                                
                                {order.orderStatus === 'DELIVERED' && (
                                    <Box sx={{ mt: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                                        <Typography variant="caption" fontWeight={700}>Rate this product</Typography>
                                        <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                                            <Rating value={reviewRating} onChange={(_, val) => setReviewRating(val || 5)} />
                                            <TextField 
                                                fullWidth 
                                                size="small" 
                                                placeholder="Write a comment..." 
                                                value={reviewComment}
                                                onChange={(e) => setReviewComment(e.target.value)}
                                            />
                                            <Button variant="contained" size="small" onClick={() => handleAddReview(item.productId)} disabled={isSubmittingReview}>Post</Button>
                                        </Stack>
                                    </Box>
                                )}
                            </Box>
                        ))}
                    </Stack>
                </Paper>

                <Paper sx={{ p: 2, borderRadius: 3, mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight={700} mb={2}>Shipping Address</Typography>
                    <Typography variant="body2">{order.address?.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {order.address?.addressLine}, {order.address?.city}, {order.address?.state} - {order.address?.pincode}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Phone: {order.address?.phone}</Typography>
                </Paper>

                <Paper sx={{ p: 2, borderRadius: 3 }}>
                    <Typography variant="subtitle2" fontWeight={700} mb={2}>Price Summary</Typography>
                    <Stack spacing={1}>
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2">Product Total</Typography>
                            <Typography variant="body2">₹{order.totalPurchaseAmount}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2">Delivery</Typography>
                            <Typography variant="body2">₹0</Typography>
                        </Box>
                        <Divider />
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="subtitle1" fontWeight={700}>Net Amount Paid</Typography>
                            <Typography variant="subtitle1" fontWeight={700}>₹{order.totalPurchaseAmount}</Typography>
                        </Box>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
};

export default OrderTracking;
