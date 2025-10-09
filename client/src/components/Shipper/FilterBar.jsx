import React from 'react';
import { Box, Stack, Chip } from '@mui/material';

const FilterBar = ({ value, onChange }) => {
  const items = [
    { key: 'near', label: 'Gần tôi' },
    { key: 'fast', label: 'Nhanh' },
    { key: 'high_fee', label: 'Phí cao' },
  ];

  const toggle = (key) => {
    const set = new Set(value);
    if (set.has(key)) set.delete(key); else set.add(key);
    onChange(Array.from(set));
  };

  return (
    <Box sx={{ px: 2, py: 1, background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
      <Stack direction="row" spacing={1}>
        {items.map((it) => (
          <Chip
            key={it.key}
            label={it.label}
            variant={value.includes(it.key) ? 'filled' : 'outlined'}
            color={value.includes(it.key) ? 'primary' : 'default'}
            onClick={() => toggle(it.key)}
            size="small"
          />
        ))}
      </Stack>
    </Box>
  );
};

export default FilterBar;


