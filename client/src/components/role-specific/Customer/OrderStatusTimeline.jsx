import { Package, Bike, MapPin, CheckCircle2 } from 'lucide-react';

export function OrderStatusTimeline({ currentStatus }) {
  const statuses = [
    { id: 'confirmed', label: 'Đã xác nhận', icon: CheckCircle2 },
    { id: 'preparing', label: 'Đang chuẩn bị', icon: Package },
    { id: 'delivering', label: 'Đang giao', icon: Bike },
    { id: 'delivered', label: 'Đã giao', icon: MapPin }
  ];

  const currentIndex = statuses.findIndex(s => s.id === currentStatus);

  return (
    <div style={{ padding: '2rem 1.25rem' }} className="order-status-timeline">
      <div style={{ display: 'flex', alignItems: 'flex-start', position: 'relative' }}>
        {statuses.map((status, index) => {
          const Icon = status.icon;
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={status.id} style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Connecting line */}
              {index < statuses.length - 1 && (
                <div style={{
                  position: 'absolute',
                  top: '1.5rem',
                  left: '50%',
                  width: '100%',
                  height: '0.2rem',
                  background: isActive ? '#ee4d2d' : '#e5e5e5',
                  zIndex: 0
                }} />
              )}
              
              {/* Icon circle */}
              <div style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '50%',
                background: isActive ? '#ee4d2d' : '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1,
                border: isCurrent ? '0.25rem solid #fff' : 'none',
                boxShadow: isCurrent ? '0 0 0 0.2rem #ee4d2d' : 'none'
              }} className="order-status-icon-circle">
                <Icon 
                  size={24} 
                  color={isActive ? '#fff' : '#999'} 
                  strokeWidth={2.5}
                />
              </div>
              
              {/* Label */}
              <div style={{
                marginTop: '0.75rem',
                fontSize: '1rem',
                color: isActive ? '#333' : '#999',
                textAlign: 'center',
                lineHeight: '1.2',
                fontWeight: isCurrent ? '600' : '400'
              }} className="order-status-label">
                {status.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
