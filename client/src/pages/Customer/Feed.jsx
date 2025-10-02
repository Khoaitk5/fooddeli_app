import React from 'react';

const Feed = () => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'white'
        }}>
            <div style={{
                width: '360px',
                height: '800px',
                position: 'relative',
                background: 'white',
                overflow: 'hidden'
            }}>
                {/* Video/content area */}
                <img
                    alt="content"
                    src="https://s3-alpha-sig.figma.com/img/333b/a4ba/992cc6194374e231c918794e92cd0086?Expires=1760313600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=XIQxQMkjRFG-3FQuj6fqCwlINp5ZL4OCZJ16UmvEtx1yY239KXbSvkxLSJpv6zqb~ePb130YWkl9Fxrk0g8wdrDMiSkNQSUBOhXpz9PvrWgeMmKdyMN4Fe4wqahYcax2l71LV4dsNeAPAodJ~XSxNBLGgsUOqB3B6cLE-TLL2nzkIP5YRxiGiorYlWK5LIjXdQEJLZULeQl2GJIiRKD21nAc9nyDuLoyEzHs0B2OeYzseroXKJ7pXGUbkKkETu4BaUyx2CTfbTJBQLYemQsRbs7l54mzm9gWl8834UGPfpTjhgOeYV~TGmGIXgBApwAbUpMR5aFloHsuh5PByWrReQ__"
                    style={{ position: 'absolute', left: 0, top: 0, width: '360px', height: '750px', objectFit: 'cover' }}
                />

                {/* Bottom nav is provided by MobileLayout via shared MobileBottomNav */}
            </div>
        </div>
    );
};

export default Feed;


