"use client";

import Image from "next/image";

const courses = [
  {
    id: 1,
    title: "Kỹ thuật tu bổ di tích gỗ",
    description: "Khóa học cung cấp kiến thức và kỹ năng thực hành về tu bổ, phục hồi các công trình kiến trúc gỗ truyền thống. Học viên được hướng dẫn trực tiếp bởi các nghệ nhân và chuyên gia hàng đầu.",
    duration: "3 tháng",
    format: "Học cuối tuần",
    image: "/content/images/2026/04/z6764346579549_7b146f62b12abe4215103cd49f7f6b37.jpg",
    topics: [
      "Nhận biết các loại gỗ truyền thống",
      "Kỹ thuật chạm khắc gỗ",
      "Phương pháp xử lý gỗ mối mọt",
      "Thực hành tại công trình thực tế",
    ],
  },
  {
    id: 2,
    title: "Bảo tồn di sản văn hóa phi vật thể",
    description: "Khóa học trang bị kiến thức về nhận diện, kiểm kê và bảo vệ các di sản văn hóa phi vật thể như nghệ thuật trình diễn, tập quán xã hội, tri thức dân gian.",
    duration: "2 tháng",
    format: "Online + Offline",
    image: "/content/images/2026/04/z7609770835178_7b4fc60cf855ff63bff6684fc007ddc7.jpg",
    topics: [
      "Phương pháp kiểm kê di sản",
      "Kỹ thuật ghi hình, ghi âm",
      "Phỏng vấn nghệ nhân",
      "Xây dựng hồ sơ di sản",
    ],
  },
  {
    id: 3,
    title: "Số hóa di sản bằng công nghệ 3D",
    description: "Khóa học ứng dụng công nghệ quét 3D laser và photogrammetry trong lưu trữ, phục dựng và quảng bá di sản kiến trúc cổ.",
    duration: "6 tuần",
    format: "Thực hành intensive",
    image: "/content/images/2026/04/z6766388585660_3bb6999b008e32ac21cadc05b7c7c0e4.jpg",
    topics: [
      "Nguyên lý quét 3D laser",
      "Xử lý point cloud data",
      "Dựng mô hình 3D",
      "Ứng dụng VR/AR trong di sản",
    ],
  },
  {
    id: 4,
    title: "Quản lý dự án bảo tồn",
    description: "Khóa học dành cho cán bộ quản lý, giám đốc dự án trong lĩnh vực bảo tồn di sản. Trang bị kỹ năng lập kế hoạch, quản lý ngân sách và giám sát thi công.",
    duration: "5 tuần",
    format: "Buổi tối",
    image: "/content/images/2026/04/z6766388140515_742d54ff5b94a2efbd717a9a1dc8a22f.jpg",
    topics: [
      "Lập đề cương dự án",
      "Quản lý tiến độ & chi phí",
      "Giám sát chất lượng thi công",
      "Nghiệm thu & bàn giao",
    ],
  },
  {
    id: 5,
    title: "Phục chế hiện vật gốm sứ",
    description: "Khóa học thực hành kỹ thuật phục chế, phục hồi hiện vật gốm sứ cổ bị nứt vỡ, sứt mẻ. Sử dụng vật liệu và phương pháp truyền thống kết hợp hiện đại.",
    duration: "8 tuần",
    format: "Cầm tay chỉ việc",
    image: "/content/images/2026/04/z6764346598671_18dac5d9406c57d8fa260c95115f96dc.jpg",
    topics: [
      "Phân loại gốm sứ các thời kỳ",
      "Kỹ thuật gắn ghép",
      "Phục hồi men màu",
      "Hoàn thiện bề mặt",
    ],
  },
  {
    id: 6,
    title: "Khảo sát & đánh giá di tích",
    description: "Khóa học phương pháp khảo sát thực địa, đánh giá hiện trạng và lập báo cáo khoa học về di tích lịch sử văn hóa.",
    duration: "4 tuần",
    format: "Thực địa",
    image: "/content/images/2026/04/z6766390524347_164bf5ce9a65eeaf942aec34b439cae7.jpg",
    topics: [
      "Phương pháp đo đạc",
      "Ghi chép hiện trạng",
      "Chụp ảnh khoa học",
      "Viết báo cáo khảo sát",
    ],
  },
];

export default function TrainingCourses() {
  return (
    <div className="courses-grid">
      {courses.map((course) => (
        <div key={course.id} className="course-card">
          <div className="course-image">
            <Image
              src={course.image}
              alt={course.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="course-content">
            <h3 className="course-title">{course.title}</h3>
            <p className="course-description">{course.description}</p>
            <div className="course-meta">
              <span className="course-duration">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                {course.duration}
              </span>
              <span className="course-format">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
                {course.format}
              </span>
            </div>
            <div className="course-topics">
              <h4>Nội dung chính:</h4>
              <ul>
                {course.topics.map((topic, index) => (
                  <li key={index}>{topic}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
