import Button from './Button';
import UserIcon from './UserIcon';

const PhoneEmailButton = ({ onClick, style, ...props }) => (
  <Button onClick={onClick} style={style} {...props}>
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 18.05,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <UserIcon />
      </div>

      <span>Sử dụng SĐT hoặc email</span>
    </div>
  </Button>
);

export default PhoneEmailButton;
