import Button from './Button';
import FacebookIcon from './FacebookIcon';

const FacebookButton = ({ onClick, style, ...props }) => (
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
          left: 18.16,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <FacebookIcon />
      </div>

      <span>Tiếp tục với Facebook</span>
    </div>
  </Button>
);

export default FacebookButton;