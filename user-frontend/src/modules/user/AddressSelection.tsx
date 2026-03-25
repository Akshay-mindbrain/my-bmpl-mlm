import { useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Typography,
    Paper,
    Button,
    Container,
    Stack,
    Radio,
    Dialog,
    DialogContent,
    TextField,
    Slide,
    IconButton,
    CircularProgress
} from "@mui/material";
import type { TransitionProps } from '@mui/material/transitions';
import React, { useState, useEffect, forwardRef } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AddIcon from '@mui/icons-material/Add';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import designConfig from "../../config/designConfig";
import PageHeader from "../../components/common/PageHeader";
import { useAddresses, useAddAddress } from "../../hooks/useEcommerce";

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AddressSelection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const { data: addressesData, isLoading } = useAddresses();
    const addresses = addressesData?.data || [];
    
    const { mutate: addAddress, isPending: isAdding } = useAddAddress();

    const [selectedId, setSelectedId] = useState<number | null>(null);

    useEffect(() => {
        if (addresses.length > 0 && !selectedId) {
            const def = addresses.find((a: any) => a.isDefault);
            setSelectedId(def ? def.id : addresses[0].id);
        }
    }, [addresses, selectedId]);

    const [openDialog, setOpenDialog] = useState(false);
    const [errorDialog, setErrorDialog] = useState<string | null>(null);
    const [newAddress, setNewAddress] = useState({
        name: '',
        phone: '',
        addressLine: '',
        city: '',
        pincode: '',
        state: '',
        type: 'Home'
    });

    const handleApply = () => {
        if (selectedId) {
            const selected = addresses.find((addr: any) => addr.id === selectedId);
            navigate('/checkout', { state: { selectedAddress: selected } });
        }
    };

    const handleSaveNewAddress = () => {
        if (!newAddress.name || !newAddress.phone || !newAddress.addressLine || !newAddress.pincode) {
            setErrorDialog("Please fill in all required fields");
            return;
        }

        addAddress(newAddress, {
            onSuccess: (res) => {
                setSelectedId(res.data.id);
                setOpenDialog(false);
                setNewAddress({
                    name: '',
                    phone: '',
                    addressLine: '',
                    city: '',
                    pincode: '',
                    state: '',
                    type: 'Home'
                });
            }
        });
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#fff", pb: 16 }}>
            <PageHeader title="Select Address" />

            <Container maxWidth="md" sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} color="primary" mb={2}>
                    Saved Addresses
                </Typography>

                {addresses.length === 0 ? (
                    <Box textAlign="center" py={4}>
                        <Typography color="text.secondary">No addresses saved yet.</Typography>
                    </Box>
                ) : (
                    <Stack spacing={2}>
                        {addresses.map((addr: any) => {
                            const isSelected = selectedId === addr.id;
                            return (
                                <Paper
                                    key={addr.id}
                                    elevation={0}
                                    onClick={() => setSelectedId(addr.id)}
                                    sx={{
                                        p: 2,
                                        borderRadius: "16px",
                                        border: `1.5px solid ${isSelected ? designConfig.colors.primary.main : '#e0e0e0'}`,
                                        display: "flex",
                                        alignItems: "flex-start",
                                        cursor: 'pointer',
                                        bgcolor: 'white'
                                    }}
                                >
                                    <Box sx={{ mr: 2, mt: 0.5, color: 'primary.main' }}>
                                        <LocationOnOutlinedIcon />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle2" fontWeight={700}>
                                            {addr.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Mobile: {addr.phone}
                                        </Typography>
                                    </Box>
                                    <Radio checked={isSelected} />
                                </Paper>
                            );
                        })}
                    </Stack>
                )}

                <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                    sx={{ mt: 3, py: 1.5, borderRadius: 3 }}
                >
                    Add New Address
                </Button>
            </Container>

            <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 2, bgcolor: 'white', borderTop: '1px solid #f0f0f0' }}>
                <Container maxWidth="md">
                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={handleApply}
                        disabled={!selectedId}
                        sx={{ py: 1.8, borderRadius: 3, fontWeight: 700 }}
                    >
                        Use This Address
                    </Button>
                </Container>
            </Box>

            {/* Add Address Dialog */}
            <Dialog fullWidth maxWidth="sm" open={openDialog} onClose={() => setOpenDialog(false)} TransitionComponent={Transition}>
                <Box p={3}>
                    <Typography variant="h6" fontWeight={700} mb={3}>Add New Address</Typography>
                    <Stack spacing={2}>
                        <TextField label="Full Name" fullWidth value={newAddress.name} onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })} />
                        <TextField label="Phone Number" fullWidth value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
                        <TextField label="Address" multiline rows={3} fullWidth value={newAddress.addressLine} onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })} />
                        <Stack direction="row" spacing={2}>
                            <TextField label="City" fullWidth value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                            <TextField label="Pincode" fullWidth value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />
                        </Stack>
                        <TextField label="State" fullWidth value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
                        
                        <Button variant="contained" fullWidth size="large" onClick={handleSaveNewAddress} disabled={isAdding} sx={{ py: 1.5, mt: 2 }}>
                            {isAdding ? <CircularProgress size={24} color="inherit" /> : 'Save Address'}
                        </Button>
                    </Stack>
                </Box>
            </Dialog>
        </Box>
    );
};

export default AddressSelection;
