import React from 'react';
import { Box, Typography, Tabs, Tab, Paper, List, ListItem, ListItemText, Button, Stack, Divider } from '@mui/material';

const Approvals = () => {
  const [tab, setTab] = React.useState(0);
  const handleChange = (_, v) => setTab(v);

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Duyệt đăng ký</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Quản lý yêu cầu đăng ký của Shipper và Shop</Typography>
      <Tabs value={tab} onChange={handleChange} sx={{ mb: 2 }}>
        <Tab label="Shipper" />
        <Tab label="Shop" />
      </Tabs>
      <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <List>
          {[1,2,3].map((id) => (
            <ListItem key={id} secondaryAction={
              <Stack direction="row" spacing={1}>
                <Button variant="contained" size="small">Duyệt</Button>
                <Button variant="outlined" color="error" size="small">Từ chối</Button>
              </Stack>
            }>
              <ListItemText primary={(tab===0?`Shipper #${id}`:`Shop #${id}`)} secondary="Thông tin đăng ký (placeholder)" />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Approvals;

