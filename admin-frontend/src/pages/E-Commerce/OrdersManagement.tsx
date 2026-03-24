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
  IconButton,
  Chip,
  CircularProgress,
  Select,
  MenuItem,
  TablePagination,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getAllOrdersApi, updateOrderStatusApi } from "../../api/orders.api";
import { toast } from "sonner";

const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getAllOrdersApi(page + 1, rowsPerPage);
      setOrders(res.data?.data || []);
      setTotal(res.data?.total || 0);
    } catch (error: any) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, rowsPerPage]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateOrderStatusApi(id, newStatus);
      toast.success("Order status updated");
      fetchOrders();
    } catch (error: any) {
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'CONFIRMED': return 'info';
      case 'PACKAGING': return 'secondary';
      case 'SHIPPING': return 'primary';
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} mb={3}>Order Management</Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell>Order #</TableCell>
              <TableCell>Member ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="center">Update Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} align="center"><CircularProgress size={24} /></TableCell></TableRow>
            ) : orders.length === 0 ? (
              <TableRow><TableCell colSpan={7} align="center">No orders found</TableCell></TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell fontWeight={600}>{order.orderNumber}</TableCell>
                  <TableCell>{order.customer?.memberId}</TableCell>
                  <TableCell>{`${order.customer?.firstName} ${order.customer?.lastName}`}</TableCell>
                  <TableCell>₹{order.totalPurchaseAmount}</TableCell>
                  <TableCell>
                    <Chip label={order.orderStatus} size="small" color={getStatusColor(order.orderStatus) as any} />
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <Select
                      size="small"
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      sx={{ minWidth: 150 }}
                    >
                      <MenuItem value="PENDING">Pending</MenuItem>
                      <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                      <MenuItem value="PACKAGING">Packaging</MenuItem>
                      <MenuItem value="SHIPPING">Shipping</MenuItem>
                      <MenuItem value="READY_FOR_DELIVERY">Ready for Delivery</MenuItem>
                      <MenuItem value="DELIVERED">Delivered</MenuItem>
                      <MenuItem value="CANCELLED">Cancelled</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        />
      </TableContainer>
    </Box>
  );
};

export default OrdersManagement;
