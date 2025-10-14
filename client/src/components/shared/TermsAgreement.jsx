// TermsAgreement.jsx
import React from 'react';

const styles = {
    container: {
        width: '100%',
        textAlign: 'center',
    },
    baseText: {
        fontSize: 10,
        lineHeight: '15px',
        fontFamily: 'Be Vietnam Pro',
        fontWeight: 400,
        color: 'rgba(22, 24, 35, 0.50)',
        whiteSpace: 'pre-line',
        margin: 0,
        display: 'inline-block',
    },
    highlight: {
        fontFamily: 'IBM Plex Sans',
        fontWeight: 600,
        color: 'rgba(22, 24, 35, 0.75)',
    },
    link: {
        fontFamily: 'IBM Plex Sans',
        fontWeight: 500,
        color: '#161823',
    },
};

const TermsAgreement = () => (
    <div style={styles.container}>
        <p style={{ ...styles.baseText, whiteSpace: 'nowrap' }}>
            Bằng việc tiếp tục với tài khoản có vị trí tại <span style={styles.highlight}>Việt Nam</span>, bạn<br></br>
            đồng ý với <span style={styles.link}>Điều khoản dịch vụ</span>, đồng thời xác nhận rằng bạn<br></br>
            đã đọc <span style={styles.link}>Chính sách quyền riêng tư</span> của chúng tôi.
        </p>
    </div>
);

export default TermsAgreement;
