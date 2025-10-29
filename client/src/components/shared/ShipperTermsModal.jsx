import { X } from 'lucide-react';

export default function ShipperTermsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '1rem',
        maxWidth: '42rem',
        width: '100%',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 1.25rem 5rem rgba(0, 0, 0, 0.2)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem',
          borderBottom: '0.0625rem solid #e5e7eb',
          position: 'sticky',
          top: 0,
          background: '#fff',
          zIndex: 10
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#f97316'
          }}>
            Điều Khoản Dịch Vụ Shipper
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          overflowY: 'auto',
          padding: '1.5rem',
          flex: 1,
          fontSize: '0.9375rem',
          lineHeight: '1.6',
          color: '#333'
        }}>
          <h3 style={{ color: '#f97316', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            1. Điều Khoản Chung
          </h3>
          <p>
            Bằng cách tham gia nền tảng FoodDeli làm Shipper, bạn đồng ý tuân thủ các điều khoản và điều kiện này. 
            Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng không tiếp tục. Những điều khoản này có thể được cập nhật bất cứ lúc nào. 
            Sử dụng tiếp tục nền tảng đồng nghĩa với việc chấp nhận các thay đổi.
          </p>

          <h3 style={{ color: '#f97316', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            2. Quyền và Nghĩa Vụ của Shipper
          </h3>
          <p>
            <strong>Quyền:</strong>
          </p>
          <ul style={{ marginLeft: '1.5rem' }}>
            <li>Được chọn lựa đơn hàng phù hợp với khả năng và thời gian của bạn</li>
            <li>Nhận thanh toán đầy đủ và kịp thời theo các chỉ định</li>
            <li>Được bảo vệ thông tin cá nhân và dữ liệu của bạn</li>
            <li>Nâng cao điểm đánh giá và xây dựng danh tiếng trên nền tảng</li>
            <li>Được hỗ trợ kỹ thuật 24/7 từ đội ngũ FoodDeli</li>
          </ul>
          <p>
            <strong>Nghĩa vụ:</strong>
          </p>
          <ul style={{ marginLeft: '1.5rem' }}>
            <li>Đăng ký thông tin chính xác và cập nhật tài liệu theo quy định</li>
            <li>Tuân thủ tất cả quy pháp luật hiện hành liên quan đến vận chuyển</li>
            <li>Duy trì phương tiện giao thông trong tình trạng tốt và an toàn</li>
            <li>Mang theo và xuất trình giấy tờ tùy thân, bằng lái xe khi yêu cầu</li>
            <li>Giao hàng đúng giờ và bảo vệ hàng hóa khỏi thiệt hại</li>
          </ul>

          <h3 style={{ color: '#f97316', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            3. Quy Định Về Giao Hàng và Thu Phí
          </h3>
          <p>
            <strong>Chấp Nhận Đơn Hàng:</strong> Bạn có quyền chấp nhận hoặc từ chối đơn hàng. Tuy nhiên, tỷ lệ chấp nhận cao 
            sẽ ảnh hưởng tích cực đến đánh giá của bạn.
          </p>
          <p>
            <strong>Thời Gian Giao Hàng:</strong> Bạn phải tuân thủ thời gian giao hàng dự kiến. Giao hàng muộn có thể dẫn đến 
            giảm điểm đánh giá và phạt.
          </p>
          <p>
            <strong>Phí Giao Hàng:</strong> Phí được tính dựa trên khoảng cách, thời gian cao điểm và tình trạng giao thông. 
            Shipper sẽ nhận lấy 85% phí giao hàng; FoodDeli thu lấy 15% phí giao hàng.
          </p>
          <p>
            <strong>Thanh Toán:</strong> Thanh toán được thực hiện hàng tuần vào thứ Hai. Số tiền sẽ được chuyển trực tiếp 
            vào tài khoản ngân hàng bạn đã đăng ký.
          </p>

          <h3 style={{ color: '#f97316', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            4. Quy Định Về Hành Vi và Đạo Đức Nghề Nghiệp
          </h3>
          <p>
            Shipper phải duy trì hành vi chuyên nghiệp tại mọi lúc:
          </p>
          <ul style={{ marginLeft: '1.5rem' }}>
            <li>Tôn trọng khách hàng và nhân viên cửa hàng</li>
            <li>Không sử dụng chất intoxicant trước hoặc trong khi làm việc</li>
            <li>Không vi phạm luật lưu thông đường bộ</li>
            <li>Mặc trang phục sạch sẽ, thích hợp</li>
            <li>Không tiếp cận hoặc sửa đổi hàng hóa của khách</li>
            <li>Bảo mật thông tin cá nhân của khách hàng</li>
          </ul>

          <h3 style={{ color: '#f97316', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            5. Chính Sách Bồi Thường và Xử Lý Vi Phạm
          </h3>
          <p>
            <strong>Thiệt Hại Hàng Hóa:</strong> Nếu hàng hóa bị hư hỏng do lỗi của bạn, bạn sẽ chịu trách nhiệm bồi thường 
            tối đa 100% giá trị đơn hàng.
          </p>
          <p>
            <strong>Khiếu Nại Khách Hàng:</strong> Nếu khách hàng khiếu nại về dịch vụ, bạn có cơ hội giải thích. Nếu được xác định 
            là lỗi của bạn, điểm đánh giá sẽ bị giảm.
          </p>
          <p>
            <strong>Vi Phạm Nghiêm Trọng:</strong> Các vi phạm như gian lận, lừa đảo hoặc hành vi bạo lực sẽ dẫn đến đình chỉ 
            hoặc chấm dứt tài khoản vĩnh viễn.
          </p>

          <h3 style={{ color: '#f97316', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            6. Bảo Mật Thông Tin
          </h3>
          <p>
            FoodDeli cam kết bảo vệ thông tin cá nhân của bạn theo luật pháp hiện hành. Chúng tôi sẽ không chia sẻ thông tin 
            của bạn với bên thứ ba mà không có sự đồng ý của bạn, trừ trường hợp yêu cầu của cơ quan chính phủ.
          </p>
          <p>
            Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và tài khoản của mình. Vui lòng thông báo ngay nếu có hoạt động 
            đáng ngờ.
          </p>

          <h3 style={{ color: '#f97316', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            7. Chấm Dứt Hợp Đồng
          </h3>
          <p>
            <strong>Chấm Dứt Do Bạn:</strong> Bạn có thể yêu cầu chấm dứt hợp tác bất kỳ lúc nào. Việc chấm dứt sẽ có hiệu lực 
            sau 30 ngày thông báo.
          </p>
          <p>
            <strong>Chấm Dứt Do FoodDeli:</strong> FoodDeli có quyền chấm dứt hợp tác nếu:
          </p>
          <ul style={{ marginLeft: '1.5rem' }}>
            <li>Bạn vi phạm các điều khoản này</li>
            <li>Điểm đánh giá của bạn dưới 3.5 sao trong 30 ngày</li>
            <li>Bạn cố ý gây thiệt hại cho nền tảng hoặc người dùng khác</li>
            <li>Bạn không hoạt động trong 90 ngày liên tục</li>
          </ul>

          <h3 style={{ color: '#f97316', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            8. Từ Chối Trách Nhiệm
          </h3>
          <p>
            FoodDeli cung cấp nền tảng "như hiện tại" và không đảm bảo không có lỗi hoặc gián đoạn. 
            Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại gián tiếp, ngẫu nhiên hoặc hậu quả nào phát sinh từ việc sử dụng nền tảng.
          </p>

          <h3 style={{ color: '#f97316', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            9. Liên Hệ Hỗ Trợ
          </h3>
          <p>
            Nếu bạn có câu hỏi hoặc mâu thuẫn liên quan đến các điều khoản này, vui lòng liên hệ:
          </p>
          <ul style={{ marginLeft: '1.5rem' }}>
            <li>Email: support@fooddeli.com</li>
            <li>Điện thoại: 1900-8888</li>
            <li>Chat trực tiếp: Tại ứng dụng FoodDeli</li>
          </ul>

          <p style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '0.0625rem solid #e5e7eb', fontStyle: 'italic', color: '#666' }}>
            <strong>Cập nhật lần cuối:</strong> Tháng 10, 2025
          </p>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1.5rem',
          borderTop: '0.0625rem solid #e5e7eb',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          background: '#f9fafb'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#f97316',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ff9447';
              e.currentTarget.style.transform = 'translateY(-0.125rem)';
              e.currentTarget.style.boxShadow = '0 0.25rem 1rem rgba(249, 115, 22, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f97316';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
