const timelineEvents = [
  {
    year: "1982",
    event: "Thành lập Xưởng Phục chế",
    description:
      "Tiền thân của Viện Bảo tồn Di tích được thành lập nhằm đáp ứng nhu cầu cấp thiết về duy tu, bảo dưỡng các di sản kiến trúc đang xuống cấp nghiêm trọng sau chiến tranh.",
  },
  {
    year: "1990",
    event: "Nâng cấp thành Trung tâm Thiết kế & Tu bổ Di tích",
    description:
      "Mở rộng chức năng từ phục chế vật thể sang thiết kế và tư vấn lập dự án tu bổ quy mô lớn, đánh dấu bước chuyển mình trong công tác bảo tồn kiến trúc gỗ truyền thống.",
  },
  {
    year: "1999",
    event: "Thành lập khu vực Miền Trung & Miền Nam",
    description:
      "Thành lập các phân viện và mạng lưới khảo sát, trực tiếp thực hiện trùng tu Quần thể Di tích Cố đô Huế, Phố cổ Hội An và Mỹ Sơn (tiến tới được UNESCO công nhận di sản thế giới).",
  },
  {
    year: "2007",
    event: "Chính thức mang tên Viện Bảo tồn Di tích",
    description:
      "Theo Quyết định của Thủ tướng Chính phủ, Viện trở thành cơ quan nghiên cứu quốc gia đầu ngành về bảo tồn di tích với 4 mảng chính: Nghiên cứu, Đào tạo, Thiết kế, và Thi công tu bổ.",
  },
  {
    year: "2018",
    event: "Kỷ nguyên Số hóa Di sản",
    description:
      "Khởi động 'Ngân hàng dữ liệu số kiến trúc cổ', áp dụng công nghệ quét 3D Laser Scanning và thiết lập bản vẽ lưu trữ kho tàng di tích Việt Nam cho muôn đời sau.",
  },
  {
    year: "Nay",
    event: "Hơn 40 năm vinh quang kiến tạo",
    description:
      "Với vô số dự án trùng tu Di tích cấp Quốc gia và Quốc gia Đặc biệt, Viện tiếp tục giương cao ngọn cờ tri thức, gìn giữ hồn cốt dân tộc qua từng vì kèo, viên ngói.",
  },
];

export default function HeritageTimeline() {
  return (
    <section className="heritage-timeline">
      {timelineEvents.map((item) => (
        <div key={item.year} className="timeline-item">
          <div className="timeline-dot">❖</div>
          <div className="timeline-content">
            <h3 className="timeline-year">{item.year}</h3>
            <h4 className="timeline-event">{item.event}</h4>
            <p>{item.description}</p>
          </div>
        </div>
      ))}
      <div className="timeline-end">✽</div>
    </section>
  );
}
