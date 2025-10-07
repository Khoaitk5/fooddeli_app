import React, { useState } from 'react';
import { Box, Typography, Button, TextField, IconButton, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon, Refresh as RefreshIcon, Visibility as ViewIcon } from '@mui/icons-material';

const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for orders
  const orders = [
    {
      id: '#001',
      customer: 'Nguyễn Văn A',
      phone: '0901234567',
      items: 'Phở bò tái x2, Nước ngọt x1',
      total: '95000',
      status: 'pending',
      orderTime: '2024-01-15 14:30',
      deliveryAddress: '123 Nguyễn Huệ, Q1, TP.HCM'
    },
    {
      id: '#002',
      customer: 'Trần Thị B',
      phone: '0901234568',
      items: 'Bún bò Huế x1, Chả cá x1',
      total: '75000',
      status: 'preparing',
      orderTime: '2024-01-15 14:25',
      deliveryAddress: '456 Lê Lợi, Q1, TP.HCM'
    },
    {
      id: '#003',
      customer: 'Lê Văn C',
      phone: '0901234569',
      items: 'Cơm tấm sườn x1, Nước ngọt x2',
      total: '80000',
      status: 'ready',
      orderTime: '2024-01-15 14:20',
      deliveryAddress: '789 Đồng Khởi, Q1, TP.HCM'
    },
    {
      id: '#004',
      customer: 'Phạm Thị D',
      phone: '0901234570',
      items: 'Bánh mì thịt nướng x2, Cà phê x1',
      total: '55000',
      status: 'delivering',
      orderTime: '2024-01-15 14:15',
      deliveryAddress: '321 Pasteur, Q3, TP.HCM'
    },
    {
      id: '#005',
      customer: 'Hoàng Văn E',
      phone: '0901234571',
      items: 'Phở gà x1, Trà đá x1',
      total: '50000',
      status: 'completed',
      orderTime: '2024-01-15 14:10',
      deliveryAddress: '654 Nguyễn Thị Minh Khai, Q3, TP.HCM'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return { bg: '#fef3c7', color: '#92400e', text: 'Chờ xử lý' };
      case 'preparing':
        return { bg: '#dbeafe', color: '#1e40af', text: 'Đang chế biến' };
      case 'ready':
        return { bg: '#dcfce7', color: '#166534', text: 'Sẵn sàng' };
      case 'delivering':
        return { bg: '#e0e7ff', color: '#3730a3', text: 'Đang giao' };
      case 'completed':
        return { bg: '#f0fdf4', color: '#15803d', text: 'Hoàn thành' };
      default:
        return { bg: '#f3f4f6', color: '#374151', text: 'Không xác định' };
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm) ||
      order.items.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'preparing', label: 'Đang chế biến' },
    { value: 'ready', label: 'Sẵn sàng' },
    { value: 'delivering', label: 'Đang giao' },
    { value: 'completed', label: 'Hoàn thành' }
  ];

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Header Actions */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '14px',
        border: '0.8px solid rgba(0,0,0,0.1)'
      }}>
        <Typography sx={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#000000',
          fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
        }}>
          Quản lý đơn hàng
        </Typography>
        
        <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <TextField
            placeholder="Tìm kiếm đơn hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{
              width: '300px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px'
              }
            }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: '#717182', mr: 1 }} />
            }}
          />
          
          <TextField
            select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            size="small"
            sx={{
              width: '150px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px'
              }
            }}
            SelectProps={{
              native: true
            }}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
          
          <IconButton
            sx={{
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#e5e7eb'
              }
            }}
          >
            <RefreshIcon sx={{ fontSize: '20px', color: '#374151' }} />
          </IconButton>
        </Box>
      </Box>

      {/* Orders Table */}
      <Box sx={{
        backgroundColor: '#ffffff',
        borderRadius: '14px',
        border: '0.8px solid rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                <TableCell sx={{
                  fontWeight: 'bold',
                  color: '#000000',
                  fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
                }}>
                  Mã đơn
                </TableCell>
                <TableCell sx={{
                  fontWeight: 'bold',
                  color: '#000000',
                  fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
                }}>
                  Khách hàng
                </TableCell>
                <TableCell sx={{
                  fontWeight: 'bold',
                  color: '#000000',
                  fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
                }}>
                  Món ăn
                </TableCell>
                <TableCell sx={{
                  fontWeight: 'bold',
                  color: '#000000',
                  fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
                }}>
                  Tổng tiền
                </TableCell>
                <TableCell sx={{
                  fontWeight: 'bold',
                  color: '#000000',
                  fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
                }}>
                  Trạng thái
                </TableCell>
                <TableCell sx={{
                  fontWeight: 'bold',
                  color: '#000000',
                  fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
                }}>
                  Thời gian
                </TableCell>
                <TableCell sx={{
                  fontWeight: 'bold',
                  color: '#000000',
                  fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
                }}>
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => {
                const statusInfo = getStatusColor(order.status);
                
                return (
                  <TableRow key={order.id} sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
                    <TableCell sx={{
                      fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
                      fontWeight: 'bold',
                      color: '#F9704B'
                    }}>
                      {order.id}
                    </TableCell>
                    <TableCell sx={{
                      fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
                    }}>
                      <Box>
                        <Typography sx={{ fontWeight: 'medium', color: '#000000' }}>
                          {order.customer}
                        </Typography>
                        <Typography sx={{ fontSize: '12px', color: '#717182' }}>
                          {order.phone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{
                      fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
                      maxWidth: '200px'
                    }}>
                      <Typography sx={{
                        fontSize: '14px',
                        color: '#000000',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {order.items}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{
                      fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
                      fontWeight: 'bold',
                      color: '#F9704B'
                    }}>
                      {parseInt(order.total).toLocaleString('vi-VN')} ₫
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusInfo.text}
                        size="small"
                        sx={{
                          backgroundColor: statusInfo.bg,
                          color: statusInfo.color,
                          fontSize: '12px',
                          fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{
                      fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
                      fontSize: '14px',
                      color: '#717182'
                    }}>
                      {order.orderTime}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor: '#f3f4f6',
                          '&:hover': {
                            backgroundColor: '#e5e7eb'
                          }
                        }}
                      >
                        <ViewIcon sx={{ fontSize: '16px', color: '#374151' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Summary Stats */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        {statusOptions.slice(1).map((status) => {
          const count = orders.filter(order => order.status === status.value).length;
          const statusInfo = getStatusColor(status.value);
          
          return (
            <Box
              key={status.value}
              sx={{
                backgroundColor: '#ffffff',
                border: '0.8px solid rgba(0,0,0,0.1)',
                borderRadius: '14px',
                padding: '20px',
                textAlign: 'center'
              }}
            >
              <Typography sx={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: statusInfo.color,
                fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif",
                marginBottom: '8px'
              }}>
                {count}
              </Typography>
              <Typography sx={{
                fontSize: '14px',
                color: '#717182',
                fontFamily: "'TikTok Sans', system-ui, Avenir, Helvetica, Arial, sans-serif"
              }}>
                {status.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default OrderManagement;


