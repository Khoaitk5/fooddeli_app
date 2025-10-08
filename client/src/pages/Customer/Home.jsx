import Navbar from '../../components/shared/Navbar';
import HeartIcon from '../../components/shared/HeartIcon';
import CommentIcon from '../../components/shared/CommentIcon';
import BookmarkIcon from '../../components/shared/BookmarkIcon';
import ShareIcon from '../../components/shared/ShareIcon';
import SearchIcon from '../../components/shared/SearchIcon';
import ProductCart from '../../components/role-specific/Customer/ProductCart';
import { pxW, pxH } from '../../utils/scale.js';
import '../../styles/customer-responsive.css';

const Home = () => {


  return (
    <div className={`h-[${pxH(800)}] w-[${pxW(360)}] overflow-hidden relative mx-auto`}>
      <div className="h-[93.75vh] overflow-y-auto snap-y snap-mandatory">
        <section className="relative h-[93.75vh] w-full snap-start">
          {/* Background video or image */}
          <img
            src="https://www.figma.com/api/mcp/asset/3030bcaa-cdb6-4d02-b0e6-a40d9b2fc9e8"
            alt="KFC Việt Nam"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Follow Status */}
          <div className="absolute top-[6.25vh] left-[28.61vw]">
            <div style={{
              opacity: 0.70,
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: "1.8rem",
              fontFamily: 'Proxima Nova',
              fontWeight: '700',
              wordWrap: 'break-word'
            }}>
              Đã follow
            </div>
          </div>

          {/* Suggestions Status */}
          <div className="absolute top-[6.25vh] right-[28.61vw]">
            <div style={{
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: "1.8rem",
              fontFamily: 'Proxima Nova',
              fontWeight: '700',
              wordWrap: 'break-word'
            }}>
              Đề xuất
            </div>
          </div>

          {/* Search Icon */}
          <div className="absolute top-[6.25vh] right-[4.8vw]">
            <SearchIcon/>
          </div>

          {/* Progress Bar */}
          <div className="absolute top-[9.125vh] right-[33.33vw]">
            <div style={{width: '8.06vw', height: '0.5vh', background: 'white'}} />
          </div>

          {/* Profile Image */}
          <div className="absolute top-[51.625vh] right-[1.94vw]">
            <img style={{width: '4.8rem', height: '4.8rem', borderRadius: 9999}} src="/KFC_logo.png" />
          </div>

          {/* Author Name */}
          <div className="absolute top-[67.75vh] left-[2.78vw]">
            <div style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              fontSize: '1.7rem',
              fontFamily: 'TikTok Sans',
              fontWeight: '600',
              wordWrap: 'break-word'
            }}>
              KFC Việt Nam
            </div>
          </div>

          {/* Caption */}
          <div className="absolute left-[2.78vw] top-[71.5vh]">
            <div style={{width: '259px', justifyContent: 'center', display: 'flex', flexDirection: 'column'}}>
              <span style={{color: 'white', fontSize: '1.5rem', fontFamily: 'TikTok Sans', fontWeight: '400', wordWrap: 'break-word'}}>
                Gà rán giòn tan, quyện thêm xốt mắm tỏi đậm đà, cay cay, ngọt ngọt, thơm nồng nàn từ tỏi và ớt. 😉
                <br/>
              </span>
              <span style={{color: 'white', fontSize: '1.5rem', fontFamily: 'TikTok Sans', fontWeight: '600', wordWrap: 'break-word'}}>
                #fyp #kfc #gaxotmamtoi
              </span>
            </div>
          </div>

          {/* Heart Icon */}
          <div className="absolute top-[487px] right-[17px]">
            <HeartIcon/>
          </div>

          {/* View Count */}
          <div className="absolute top-[523px] right-[11.5px]">
            <div style={{
              textAlign: 'center',
              color: 'white',
              fontSize: 12,
              fontFamily: 'Proxima Nova',
              fontWeight: '600',
              wordWrap: 'break-word',
              textShadow: '1px 1px 1px rgba(0, 0, 0, 0.25)'
            }}>
              250,5K
            </div>
          </div>

          {/* Comment Icon */}
          <div className="absolute top-[552px] right-[17px]">
            <CommentIcon width="27" height="26" />
          </div>

          {/* Comment Count */}
          <div className="absolute top-[588px] right-[17.5px]">
            <div style={{
              textAlign: 'center',
              color: 'white',
              fontSize: 12,
              fontFamily: 'Proxima Nova',
              fontWeight: '600',
              wordWrap: 'break-word',
              textShadow: '1px 1px 1px rgba(0, 0, 0, 0.25)'
            }}>
              100K
            </div>
          </div>

          {/* Bookmark Icon */}
          <div className="absolute top-[618px] right-[20px]">
            <BookmarkIcon width="22" height="24" />
          </div>

          {/* Bookmark Count */}
          <div className="absolute top-[653px] right-[20px]">
            <div style={{
              textAlign: 'center',
              color: 'white',
              fontSize: 12,
              fontFamily: 'Proxima Nova',
              fontWeight: '600',
              wordWrap: 'break-word',
              textShadow: '1px 1px 1px rgba(0, 0, 0, 0.25)'
            }}>
              89K
            </div>
          </div>

          {/* Share Icon */}
          <div className="absolute top-[681px] right-[17px]">
            <ShareIcon width="27" height="26" />
          </div>

          {/* Share Count */}
          <div className="absolute top-[718px] right-[13px]">
            <div style={{
              textAlign: 'center',
              color: 'white',
              fontSize: 12,
              fontFamily: 'Proxima Nova',
              fontWeight: '600',
              wordWrap: 'break-word',
              textShadow: '1px 1px 1px rgba(0, 0, 0, 0.25)'
            }}>
              132,5K
            </div>
          </div>

          {/* Product Cart */}
          <div className="absolute top-[660px] left-[10px]">
            <ProductCart />
          </div>
        </section>
      </div>
      <Navbar />
    </div>
  );
};

export default Home;