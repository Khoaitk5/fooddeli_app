import PotIcon from './PotIcon';

const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <PotIcon />
    <div style={{ marginLeft: '3.87px' }}>
      <span style={{ color: '#F9704B', fontSize: 25, fontFamily: 'TikTok Sans', fontWeight: '500', wordWrap: 'break-word' }}>Food</span>
      <span style={{ color: '#F9704B', fontSize: 25, fontFamily: 'TikTok Sans', fontWeight: '700', wordWrap: 'break-word' }}>Deli</span>
    </div>
  </div>
);

export default Logo;