import Button from './Button';
import MessageIcon from './MessageIcon';

const MessageButton = ({ onClick, style, ...props }) => (
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
    <MessageIcon />
  </Button>
);

export default MessageButton;