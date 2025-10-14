import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackArrow from '../../../components/shared/BackArrow';
import ClearIcon from '../../../components/shared/ClearIcon';
import FilterIcon from '../../../components/shared/FilterIcon';
import SortIcon from '../../../components/shared/SortIcon';
import DownArrow from '../../../components/shared/DownArrow';
import TagIcon from '../../../components/shared/TagIcon';
import FoodResults from '../../shared/FoodResultItem';
import VideoResults from '../../shared/VideoResultItem';
import AccountResultItem from '../../shared/AccountResultItem';


const SearchResults = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('food');

  const getTabColor = (tabName) => {
    return activeTab === tabName ? 'black' : '#8A8B8F';
  };

  const tabStyle = {
    position: 'absolute',
    top: '11.75vh',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    fontSize: '1.4rem',
    fontFamily: 'Be Vietnam Pro',
    fontWeight: '600',
    wordWrap: 'break-word',
    cursor: 'pointer',
    zIndex: 2, // Above separator line
  };

  const tabs = [
    { id: 'food', label: 'Đồ ăn', left: '10vw' },
    { id: 'video', label: 'Video', left: '40.83vw' },
    { id: 'account', label: 'Tài khoản', left: '71.94vw' },
  ];

  const getActiveTabIndicatorPosition = () => {
    const positions = {
      food: '0vw',
      video: '31.39vw',
      account: 'auto'
    };
    return positions[activeTab] || '0vw';
  };

  const getActiveTabIndicatorStyle = () => {
    const baseStyle = {
      position: 'absolute',
      top: '15.5vh',
      height: '100%',
      outline: '2px black solid',
      outlineOffset: '-1px',
      zIndex: 3, // Above tabs, below BackArrow
    };

    if (activeTab === 'account') {
      return {
        ...baseStyle,
        right: '0vw',
        width: '37.5vw', // Special width for account tab
      };
    }

    return {
      ...baseStyle,
      left: getActiveTabIndicatorPosition(),
      width: '31.11vw', // Default width for other tabs
    };
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Back Arrow */}
      <div
        style={{
          position: 'absolute',
          top: '7.125vh',
          left: '6.67vw',
          zIndex: 15,
        }}
      >
        <BackArrow onClick={() => navigate(-1)} />
      </div>

      {/* Search Bar */}
      <div
        style={{
          position: 'absolute',
          top: '5.625vh',
          left: '15.28vw',
          width: '79.4vw',
          height: '4.5vh',
          background: '#F5F5F5',
          borderRadius: 10,
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: '3.61vw',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <ClearIcon />
        </div>
      </div>

      {/* Tabs */}
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            ...tabStyle,
            left: tab.left,
            color: getTabColor(tab.id),
          }}
        >
          {tab.label}
        </div>
      ))}

      {/* Active Tab Indicator */}
      <div style={getActiveTabIndicatorStyle()} />

      {/* Separator Line */}
      <div
        style={{
          position: 'absolute',
          top: '15.5vh',
          left: '0',
          right: '0',
          width: '100%',
          height: '100%',
          outline: '0.30px #E7E7E7 solid',
          outlineOffset: '-0.15px',
          zIndex: 1,
        }}
      />

      {/* Filter Container - Scrollable */}
      {activeTab === 'food' && (
        <div
          style={{
            position: 'absolute',
            top: '17.375vh',
            left: '0',
            right: '0',
            width: '100%',
            height: '4.125vh',
            display: 'flex',
            gap: '2.22vw',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE and Edge
            paddingLeft: '4.17vw',
            paddingRight: '4.17vw',
            boxSizing: 'border-box',
          }}
          className="scrollbar-hide" // Custom class for webkit scrollbar
        >
        {/* Filter Button 1 */}
        <div
          style={{
            minWidth: '12.22vw',
            height: '100%',
            borderRadius: 16,
            border: '1px #B3B3B3 solid',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          onClick={() => navigate('/customer/filters')}
        >
          <FilterIcon />
        </div>

        {/* Filter Button 2 */}
        <div
          style={{
            minWidth: '34.72vw',
            height: '100%',
            borderRadius: 16,
            border: '1px #B3B3B3 solid',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            position: 'relative',
          }}
          onClick={() => console.log('Filter clicked')}
        >
          <div
            style={{
              position: 'absolute',
              left: '4.167vw',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SortIcon />
          </div>
          <div
            style={{
              position: 'absolute',
              left: '10vw',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'black',
              fontSize: '1.3rem',
              fontWeight: '500',
              wordWrap: 'break-word',
            }}
          >
            Lọc theo
          </div>
          <div
            style={{
              position: 'absolute',
              right: '4.167vw',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DownArrow />
          </div>
        </div>

        {/* Filter Button 3 */}
        <div
          style={{
            minWidth: '37.22vw',
            height: '100%',
            borderRadius: 16,
            border: '1px #B3B3B3 solid',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            position: 'relative',
          }}
          onClick={() => console.log('Filter clicked')}
        >
          <div
            style={{
              position: 'absolute',
              left: '4.167vw',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'black',
              fontSize: '1.3rem',
              fontWeight: '500',
              wordWrap: 'break-word',
            }}
          >
            Phí giao hàng
          </div>
          <div
            style={{
              position: 'absolute',
              right: '4.167vw',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DownArrow />
          </div>
        </div>

        {/* Filter Button 4 */}
        <div
          style={{
            minWidth: '37.22vw',
            height: '100%',
            borderRadius: 16,
            border: '1px #B3B3B3 solid',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            position: 'relative',
          }}
          onClick={() => console.log('Filter clicked')}
        >
          <div
            style={{
              position: 'absolute',
              left: '4.167vw',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TagIcon />
          </div>
          <div
            style={{
              position: 'absolute',
              left: '10.28vw',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'black',
              fontSize: '1.3rem',
              fontWeight: '500',
              wordWrap: 'break-word',
            }}
          >
            Khuyến mãi
          </div>
        </div>
      </div>
      )}

      {/* Search Results */}
      <div
        style={{
          position: 'absolute',
          top: activeTab === 'food' ? '23vh' : '17.375vh',
          left: '0',
          right: '0',
          width: '100%',
          height: activeTab === 'food' ? 'calc(100vh - 23vh)' : 'calc(100vh - 16vh)',
          overflowY: 'auto',
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE and Edge
          boxSizing: 'border-box',
        }}
        className="scrollbar-hide" // Custom class for webkit scrollbar
      >
        {activeTab === 'food' && <FoodResults />}
        {activeTab === 'video' && <VideoResults />}
        {activeTab === 'account' && <AccountResultItem />}
      </div>
    </div>
  );
};

export default SearchResults;

