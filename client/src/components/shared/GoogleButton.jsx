import Button from './Button';
import GoogleIcon from './GoogleIcon';

const GoogleButton = ({ onClick, style, ...props }) => (
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
    <GoogleIcon />
  </Button>
);

export default GoogleButton;