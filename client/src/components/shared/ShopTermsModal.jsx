import { X } from 'lucide-react';

export default function ShopTermsModal({ isOpen, onClose }) {
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
            color: '#10b981'
          }}>
            Điều Khoản Dịch Vụ Shop
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
          <h3 style={{ color: '#10b981', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            1. Điều Khoản Chung
          </h3>
          <p>
            Bằng cách tham gia nền tảng FoodDeli làm chủ Shop, bạn đồng ý tuân thủ các điều khoản và điều kiện này. 
            Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng không tiếp tục. Những điều khoản này có thể được cập nhật bất cứ lúc nào. 
            Sử dụng tiếp tục nền tảng đồng nghĩa với việc chấp nhận các thay đổi.
          </p>

          <h3 style={{ color: '#10b981', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            2. Quyền và Nghĩa Vụ của Chủ Shop
          </h3>
          <p>
            <strong>Quyền:</strong>
          </p>
          <ul style={{ marginLeft: '1.5rem' }}>
            <li>Quản lý thực đơn và giá cả sản phẩm của riêng mình</li>
            <li>Nhận thanh toán đầy đủ và kịp thời từ đơn hàng bán được</li>
            <li>Được bảo vệ thông tin kinh doanh và dữ liệu khách hàng</li>
            <li>Nâng cao đánh giá shop và xây dựng uy tín trên nền tảng</li>
            <li>Được hỗ trợ kỹ thuật và tư vấn kinh doanh 24/7</li>
            <li>Truy cập các công cụ phân tích doanh số và khách hàng</li>
          </ul>
          <p>
            <strong>Nghĩa vụ:</strong>
          </p>
          <ul style={{ marginLeft: '1.5rem' }}>
            <li>Đăng ký thông tin kinh doanh chính xác và cập nhật đầy đủ</li>
            <li>Tuân thủ tất cả quy pháp luật về vệ sinh an toàn thực phẩm</li>
            <li>Cấp phép kinh doanh phải hợp lệ và được kiểm duyệt</li>
            <li>Cập nhật thông tin sản phẩm, giá cả và tình trạng hàng đầy đủ</li>
            <li>Đóng gói hàng an toàn, sạch sẽ và đúng như đơn hàng</li>
            <li>Phục vụ khách hàng với thái độ chuyên nghiệp và lịch sự</li>
          </ul>

          <h3 style={{ color: '#10b981', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            3. Quy Định Về Sản Phẩm và Vệ Sinh An Toàn Thực Phẩm
          </h3>
          <p>
            <strong>Chất Lượng Sản Phẩm:</strong> Tất cả sản phẩm phải:
          </p>
          <ul style={{ marginLeft: '1.5rem' }}>
            <li>Tuân thủ các tiêu chuẩn vệ sinh an toàn thực phẩm</li>
            <li>Không quá hạn sử dụng khi giao hàng</li>
            <li>Được bảo quản đúng cách theo yêu cầu</li>
            <li>Có mô tả chính xác về thành phần và hạn sử dụng</li>
            <li>Không chứa chất cấm hoặc nguy hiểm cho sức khỏe</li>
          </ul>
          <p>
            <strong>Hình Ảnh Sản Phẩm:</strong> Hình ảnh đăng tải phải thực tế, không được photoshop quá mức hoặc gây hiểu lầm. 
            FoodDeli có quyền xóa ảnh không phù hợp.
          </p>
          <p>
            <strong>Kiểm Tra Định Kỳ:</strong> FoodDeli có quyền kiểm tra vệ sinh cơ sở kinh doanh của bạn bất cứ lúc nào. 
            Không tuân thủ sẽ dẫn đến cảnh cáo hoặc tạm đình chỉ.
          </p>

          <h3 style={{ color: '#10b981', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            4. Quy Định Về Giá Cả và Khuyến Mãi
          </h3>
          <p>
            <strong>Giá Cả:</strong> Bạn có toàn quyền thiết lập giá bán cho sản phẩm của mình. Tuy nhiên, giá phải hợp lý so với thị trường.
          </p>
          <p>
            <strong>Khuyến Mãi:</strong> Các đợt khuyến mãi phải:
          </p>
          <ul style={{ marginLeft: '1.5rem' }}>
            <li>Được công bố rõ ràng và công khai trước</li>
            <li>Không gây thua lỗ cho bạn hoặc gây hiểu lầm cho khách hàng</li>
            <li>Tuân thủ quy định của FoodDeli về khuyến mãi</li>
            <li>Phải có đủ hàng tồn kho để thực hiện</li>
          </ul>
          <p>
            <strong>Flash Sale:</strong> Khi tham gia Flash Sale, bạn đồng ý áp dụng giá khuyến mãi từ FoodDeli. 
            Bạn không được từ chối đơn hàng hoặc thay đổi giá sau khi Flash Sale kết thúc.
          </p>

          <h3 style={{ color: '#10b981', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            5. Chính Sách Đối Với Đơn Hàng và Khách Hàng
          </h3>
          <p>
            <strong>Xác Nhận Đơn Hàng:</strong> Bạn phải xác nhận hoặc từ chối đơn hàng trong vòng 5 phút. 
            Nếu vượt quá thời gian, đơn hàng sẽ được gán cho shop khác.
          </p>
          <p>
            <strong>Thời Gian Chuẩn Bị:</strong> Bạn phải chuẩn bị hàng trong thời gian dự kiến. Nếu quá lâu, khách hàng có quyền hủy.
          </p>
          <p>
            <strong>Hủy Đơn Hàng:</strong> Nếu bạn hủy đơn hàng vì lý do không hợp lệ (hàng còn, tính nhầm giá, vv), bạn sẽ bị:
          </p>
          <ul style={{ marginLeft: '1.5rem' }}>
            <li>Giảm điểm đánh giá</li>
            <li>Bị phạt từ 50,000 - 500,000 đồng tùy trường hợp</li>
            <li>Nếu hủy quá 5 đơn/tuần, tài khoản sẽ bị tạm đình chỉ</li>
          </ul>
          <p>
            <strong>Đối Xử Với Khách Hàng:</strong> Bạn phải:
          </p>
          <ul style={{ marginLeft: '1.5rem' }}>
            <li>Trả lời tin nhắn từ khách hàng trong vòng 1 giờ</li>
            <li>Giải quyết khiếu nại một cách lịch sự và công bằng</li>
            <li>Không lăng mạ hoặc phân biệt đối xử với khách hàng</li>
            <li>Hỗ trợ khách hàng liên hệ về sản phẩm hoặc dịch vụ</li>
          </ul>

          <h3 style={{ color: '#10b981', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            6. Phí Dịch Vụ và Thanh Toán
          </h3>
          <p>
            <strong>Phí Dịch Vụ:</strong> FoodDeli tính hoa hồng cố định 25% trên mỗi đơn hàng bán được. 
            Mức hoa hồng này không thay đổi và sẽ được trừ trực tiếp từ giá trị đơn hàng.
          </p>
          <p>
            <strong>Phí Giao Dịch:</strong> Nếu khách hàng thanh toán bằng card, FoodDeli sẽ trích 1-2% phí xử lý.
          </p>
          <p>
            <strong>Thanh Toán:</strong> Thanh toán được thực hiện hàng tuần vào thứ Năm. 
            Số tiền sẽ được chuyển vào tài khoản ngân hàng bạn đã đăng ký sau khi trừ tất cả các khoản phí.
          </p>
          <p>
            <strong>Hoàn Tiền:</strong> Nếu khách hàng yêu cầu hoàn tiền, bạn sẽ chịu khoản hoàn tiền đó. 
            FoodDeli sẽ xử lý việc hoàn tiền cho khách hàng.
          </p>

          <h3 style={{ color: '#10b981', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            7. Bảo Mật Thông Tin
          </h3>
          <p>
            FoodDeli cam kết bảo vệ thông tin kinh doanh và khách hàng của bạn theo luật pháp hiện hành. 
            Chúng tôi sẽ không chia sẻ thông tin với bên thứ ba mà không có sự đồng ý của bạn.
          </p>
          <p>
            Bạn chịu trách nhiệm bảo mật thông tin đăng nhập tài khoản. Vui lòng thông báo ngay nếu phát hiện truy cập trái phép.
          </p>
          <p>
            Thông tin khách hàng (điện thoại, địa chỉ) phải được bảo mật. Bạn không được sử dụng thông tin này cho mục đích khác 
            ngoài giao hàng.
          </p>

          <h3 style={{ color: '#10b981', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            8. Xử Lý Vi Phạm
          </h3>
          <p>
            <strong>Cảnh Cáo:</strong> Vi phạm lần đầu sẽ bị cảnh cáo. FoodDeli sẽ thông báo chi tiết qua email.
          </p>
          <p>
            <strong>Tạm Đình Chỉ:</strong> Vi phạm lần 2-3 sẽ bị tạm đình chỉ từ 3-7 ngày. 
            Trong thời gian này, shop sẽ không thể nhận đơn hàng mới.
          </p>
          <p>
            <strong>Chấm Dứt Vĩnh Viễn:</strong> Các hành vi sau sẽ dẫn đến chấm dứt vĩnh viễn:
          </p>
          <ul style={{ marginLeft: '1.5rem' }}>
            <li>Gian lận hoặc lừa đảo khách hàng</li>
            <li>Bán sản phẩm hôi thối, hết hạn hoặc nguy hiểm</li>
            <li>Bạo lực hoặc lăng mạ khách hàng/nhân viên</li>
            <li>Vi phạm hơn 5 lần trong 3 tháng</li>
            <li>Đánh giá shop dưới 2 sao trong 30 ngày liên tục</li>
          </ul>

          <h3 style={{ color: '#10b981', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            9. Chấm Dứt Hợp Đồng
          </h3>
          <p>
            <strong>Chấm Dứt Do Bạn:</strong> Bạn có thể yêu cầu chấm dứt hợp tác bất cứ lúc nào bằng cách thông báo cho FoodDeli. 
            Việc chấm dứt sẽ có hiệu lực sau 30 ngày.
          </p>
          <p>
            <strong>Chấm Dứt Do FoodDeli:</strong> FoodDeli có quyền chấm dứt hợp tác ngay lập tức nếu bạn vi phạm các điều khoản nghiêm trọng.
          </p>

          <h3 style={{ color: '#10b981', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            10. Từ Chối Trách Nhiệm
          </h3>
          <p>
            FoodDeli cung cấp nền tảng "như hiện tại" và không đảm bảo không có lỗi hoặc gián đoạn. 
            Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại gián tiếp, ngẫu nhiên hoặc hậu quả nào phát sinh từ việc sử dụng nền tảng.
          </p>

          <h3 style={{ color: '#10b981', fontWeight: '600', marginTop: '1.5rem', marginBottom: '0.75rem' }}>
            11. Liên Hệ Hỗ Trợ
          </h3>
          <p>
            Nếu bạn có câu hỏi hoặc mâu thuẫn liên quan đến các điều khoản này, vui lòng liên hệ:
          </p>
          <ul style={{ marginLeft: '1.5rem' }}>
            <li>Email: shop-support@fooddeli.com</li>
            <li>Điện thoại: 1900-9999</li>
            <li>Chat trực tiếp: Tại trang quản lý shop FoodDeli</li>
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
              background: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#34d399';
              e.currentTarget.style.transform = 'translateY(-0.125rem)';
              e.currentTarget.style.boxShadow = '0 0.25rem 1rem rgba(16, 185, 129, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#10b981';
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
