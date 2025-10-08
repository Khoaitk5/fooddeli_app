import React from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';

const steps = ['Nhận đơn', 'Lấy hàng', 'Đang giao', 'Hoàn tất'];

const mapStatusToIndex = (status) => {
  switch (status) {
    case 'accepted':
      return 1;
    case 'picked':
      return 2;
    case 'delivering':
      return 3;
    case 'completed':
      return 4;
    default:
      return 0;
  }
};

const StatusStepper = ({ status }) => {
  const activeStep = mapStatusToIndex(status);
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default StatusStepper;


