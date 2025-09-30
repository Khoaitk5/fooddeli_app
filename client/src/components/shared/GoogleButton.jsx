import Button from './Button';
import GoogleIcon from './GoogleIcon';

const GoogleButton = ({ onClick, style, ...props }) => (
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
        <GoogleIcon />
      </div>

      <span style={{
        fontSize: 13,
        fontFamily: 'TikTok Sans',
        fontWeight: '600',
        color: 'black'
      }}>Tiếp tục với Google</span>
    </div>
  </Button>
);

export default GoogleButton;