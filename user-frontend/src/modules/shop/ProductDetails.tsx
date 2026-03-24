import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, Button, Paper, Container, useTheme, useMediaQuery, CircularProgress, Rating, Stack } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import designConfig from "../../config/designConfig";
import { useProductDetails, useAddToCart } from "../../hooks/useEcommerce";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    
    const { data: productData, isLoading } = useProductDetails(Number(id));
    const product = productData?.data;

    const { mutate: addToCart, isPending: isAdding } = useAddToCart();

    useEffect(() => {
        if (product) {
            window.scrollTo(0, 0);
        }
    }, [product]);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!product) {
        return <Box sx={{ p: 4, textAlign: 'center' }}>Product not found</Box>;
    }

    const handleAddToCart = () => {
        addToCart({ productId: product.id, quantity: 1 });
    };

    const discount = Math.round(((product.mrp_amount - product.dp_amount) / product.mrp_amount) * 100);
    const bvPoints = Math.floor(product.dp_amount / 10);

    return (
        <Box sx={{
            minHeight: "100vh",
            bgcolor: "#fff",
            pb: isMobile ? 22 : 10,
            width: '100%',
            maxWidth: '100vw',
            overflowX: "hidden",
            position: 'relative'
        }}>
            {/* Header */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                position: 'sticky',
                top: 0,
                bgcolor: 'white',
                zIndex: 1100,
                borderBottom: '1px solid #f0f0f0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                width: '100%',
                maxWidth: '100vw'
            }}>
                <IconButton
                    onClick={() => navigate(-1)}
                    sx={{
                        bgcolor: designConfig.colors.primary.main,
                        color: "white",
                        borderRadius: "12px",
                        width: 40,
                        height: 40,
                        "&:hover": { bgcolor: designConfig.colors.primary.dark },
                        mr: 2,
                        flexShrink: 0
                    }}
                >
                    <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
                </IconButton>
                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                        flex: 1,
                        fontSize: { xs: '0.95rem', md: '1.25rem' },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        pr: 2
                    }}
                >
                    {product.productName}
                </Typography>
            </Box>

            <Container maxWidth="md" sx={{ px: 2, mt: 2 }}>
                {/* Product Image */}
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                    <Box
                        component="img"
                        src={product.productmainimage}
                        alt={product.productName}
                        sx={{
                            width: '100%',
                            maxWidth: { xs: 280, sm: 350 },
                            height: 'auto',
                            objectFit: 'contain'
                        }}
                    />
                </Box>

                {/* Product Info */}
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                    {product.productName}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <Rating value={4.5} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary">
                        (4.5/5)
                    </Typography>
                </Stack>

                <Box sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={2} alignItems="baseline">
                        <Typography variant="h4" fontWeight={800} color="primary">
                            ₹{product.dp_amount}
                        </Typography>
                        <Typography variant="h6" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                            ₹{product.mrp_amount}
                        </Typography>
                        <Chip label={`${discount}% OFF`} color="error" size="small" sx={{ fontWeight: 700 }} />
                    </Stack>
                </Box>

                <Box sx={{ bgcolor: '#E8F5E9', p: 2, borderRadius: 2, mb: 3, border: '1px solid #C8E6C9' }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Chip label={`${bvPoints} BV`} color="primary" sx={{ fontWeight: 700 }} />
                        <Typography variant="body2" fontWeight={600} color="success.main">
                            Earn {bvPoints} business value points on this purchase
                        </Typography>
                    </Stack>
                </Box>

                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                    Description
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                    {product.description}
                </Typography>

                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                    Specifications
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, mb: 4, bgcolor: '#fafafa' }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                        {product.specifaction}
                    </Typography>
                </Paper>

                {/* Reviews Section */}
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    Customer Reviews
                </Typography>
                {product.reviews?.length > 0 ? (
                    <Stack spacing={2} sx={{ mb: 4 }}>
                        {product.reviews.map((review: any) => (
                            <Paper key={review.id} sx={{ p: 2 }}>
                                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                    <Typography fontWeight={700}>
                                        {review.user.firstName} {review.user.lastName}
                                    </Typography>
                                    <Rating value={review.rating} readOnly size="small" />
                                </Stack>
                                <Typography variant="body2" color="text.secondary">
                                    {review.comment}
                                </Typography>
                                {review.images && (
                                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                        {review.images.split(',').map((img: string, idx: number) => (
                                            <Box
                                                key={idx}
                                                component="img"
                                                src={img}
                                                sx={{ width: 60, height: 60, borderRadius: 1, objectFit: 'cover' }}
                                            />
                                        ))}
                                    </Stack>
                                )}
                            </Paper>
                        ))}
                    </Stack>
                ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                        No reviews yet. Be the first to review!
                    </Typography>
                )}
            </Container>

            {/* Sticky Footer */}
            <Box sx={{
                position: 'fixed',
                bottom: isMobile ? 80 : 0,
                left: 0,
                right: 0,
                bgcolor: 'white',
                p: 2,
                boxShadow: '0 -4px 12px rgba(0,0,0,0.08)',
                borderTop: '1px solid #f0f0f0',
                zIndex: 1100
            }}>
                <Container maxWidth="md">
                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        startIcon={<ShoppingCartIcon />}
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        sx={{ py: 1.5, borderRadius: 3, fontWeight: 700 }}
                    >
                        {isAdding ? <CircularProgress size={24} color="inherit" /> : 'Add to Cart'}
                    </Button>
                </Container>
            </Box>
        </Box>
    );
};

export default ProductDetails;
