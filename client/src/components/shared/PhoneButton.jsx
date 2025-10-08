import Button from './Button';
import PhoneIcon from './PhoneIcon';

const PhoneButton = ({ onClick, style, ...props }) => (
  <Button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style
    }}
    {...props}
  >
    <PhoneIcon />
  </Button>
);

export default PhoneButton;