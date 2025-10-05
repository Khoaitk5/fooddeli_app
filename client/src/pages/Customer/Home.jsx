import VerifiedBadge from '../../components/role-specific/Customer/VerifiedBadge';
import SidebarActions from '../../components/role-specific/Customer/SidebarActions';
import ProductMiniCard from '../../components/role-specific/Customer/ProductMiniCard';

const posts = [
  {
    id: 'kfc-1',
    author: 'KFC Việt Nam',
    videoOrImage: 'https://www.figma.com/api/mcp/asset/3030bcaa-cdb6-4d02-b0e6-a40d9b2fc9e8',
    caption:
      'Gà rán giòn tan, xốt mắm tỏi đậm đà, cay cay, ngọt ngọt, thơm nồng từ tỏi và ớt. #fyp #kfc #gaxotmamtoi',
    product: {
      thumb: 'https://www.figma.com/api/mcp/asset/ef8944b3-5389-43b9-a54f-6c2df3a1f55c',
      title: '1 Miếng Gà Xốt Mắm Tỏi',
      price: '40.000',
      oldPrice: '₫50.000',
    },
  },
  {
    id: 'pizza-1',
    author: 'Pizza House',
    videoOrImage: 'https://www.figma.com/api/mcp/asset/3030bcaa-cdb6-4d02-b0e6-a40d9b2fc9e8',
    caption: 'Pizza phô mai kéo sợi, vỏ mỏng giòn. #pizza #cheese',
    product: {
      thumb: 'https://www.figma.com/api/mcp/asset/ef8944b3-5389-43b9-a54f-6c2df3a1f55c',
      title: 'Pizza Phô Mai Cỡ M',
      price: '99.000',
      oldPrice: '₫129.000',
    },
  },
];

const Home = () => {
  const AVATAR = 'https://www.figma.com/api/mcp/asset/d9092fce-9d81-4e46-91c8-8ccde93eb698';
  const LIKE_ICON = 'https://www.figma.com/api/mcp/asset/eff637bd-8880-4c59-acfe-e0367122a86e';
  const BOOKMARK_ICON = 'https://www.figma.com/api/mcp/asset/29ac3aeb-a23f-4cd8-a1ed-ec5c2b29b43d';
  const SHARE_ICON = 'https://www.figma.com/api/mcp/asset/e24e5400-ed4c-4d52-aee9-8fe375cd7bed';
  const VERIFIED_TICK = 'https://www.figma.com/api/mcp/asset/d391cf57-08e2-40cf-bbcb-f0c93c255a07';
  const VERIFIED_RING = 'https://www.figma.com/api/mcp/asset/2702eb1f-ed81-46a7-a037-e933429c5398';
  const FLASH_ICON = 'https://www.figma.com/api/mcp/asset/1fccae55-6378-4b09-9b80-0af039004257';
  const STAR_ICON = 'https://www.figma.com/api/mcp/asset/0235e539-0e53-4ba9-8079-f5b2544c8f02';

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto snap-y snap-mandatory">
      {posts.map((post) => (
        <section key={post.id} className="relative h-[calc(100vh-64px)] w-full snap-start">
          {/* Background video or image */}
          <img
            src={post.videoOrImage}
            alt={post.author}
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Right actions */}
          <div className="absolute right-3 bottom-28">
            <SidebarActions
              avatarSrc={AVATAR}
              likeIcon={LIKE_ICON}
              bookmarkIcon={BOOKMARK_ICON}
              shareIcon={SHARE_ICON}
            />
          </div>

          {/* Caption */}
          <div className="absolute left-3 right-28 bottom-24 text-white">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold">{post.author}</span>
              <VerifiedBadge ringSrc={VERIFIED_RING} tickSrc={VERIFIED_TICK} />
            </div>
            <p className="mt-1.5 text-sm leading-snug">{post.caption}</p>
          </div>

          {/* Product card */}
          <div className="absolute left-3 right-3 bottom-6">
            <ProductMiniCard
              thumbSrc={post.product.thumb}
              flashIcon={FLASH_ICON}
              starIcon={STAR_ICON}
              title={post.product.title}
              price={post.product.price}
              oldPrice={post.product.oldPrice}
              containerSx={{}}
            />
          </div>
        </section>
      ))}
    </div>
  );
};

export default Home;