# Hướng dẫn tạo Album ảnh trên Ghost CMS

## Cách tạo Album mới

### Bước 1: Tạo Page với tag "album"

1. Vào **Ghost Admin** → **Pages** → **New page**
2. Đặt tiêu đề album (ví dụ: "Hoạt động bảo tồn 2026")
3. Viết mô tả ngắn vào phần **Excerpt**
4. Thêm tag **`album`** vào bài viết (bắt buộc)

### Bước 2: Thêm ảnh vào album

Có 2 cách để thêm ảnh:

**Cách 1: Dùng Image Card trong Editor**
- Click dấu `+` để thêm block
- Chọn **Image**
- Upload ảnh hoặc chọn từ thư viện
- Lặp lại cho mỗi ảnh

**Cách 2: Dùng HTML Card** (khuyến nghị cho nhiều ảnh)
- Click dấu `+` để thêm block
- Chọn **HTML**
- Dán code:
```html
<img src="/content/images/2026/04/ten-anh.jpg" alt="Mô tả ảnh" />
<img src="/content/images/2026/04/ten-anh-2.jpg" alt="Mô tả ảnh 2" />
```

### Bước 3: Cấu hình SEO (tuỳ chọn)

- **Meta Description**: Mô tả hiển thị trên Google
- **Cover Image**: Ảnh đại diện album (hiển thị ở trang danh sách)

### Bước 4: Publish

- Click **Publish** → **Publish now**

## Cách tạo album với ảnh từ bài viết

Nếu bạn đã có bài viết với ảnh, có thể tag thêm **`album-{slug}`** vào bài viết đó.

Ví dụ:
- Tạo album slug `hoat-dong-baoton` → tag bài viết là `album-hoat-dong-baoton`
- Album sẽ tự động hiển thị các ảnh từ bài viết có tag này

## Upload ảnh vào Ghost

1. Vào **Ghost Admin** → **Settings** → **Media**
2. Hoặc upload trực tiếp khi viết bài
3. Ảnh sẽ được lưu vào `content/images/2026/04/`

## Cấu trúc dữ liệu

```
Page (tag: album)
├── Title: Tên album
├── Excerpt: Mô tả ngắn
├── Feature Image: Ảnh bìa
└── HTML Content: Các thẻ <img>
```

## Frontend Route

- Trang danh sách: `/ngan-hang-hinh-anh`
- Trang chi tiết album: `/ngan-hang-hinh-anh/{slug}`

## Ví dụ JSON Import

```json
{
  "pages": [
    {
      "title": "Hoạt động bảo tồn 2026",
      "slug": "hoat-dong-baoton-2026",
      "html": "<img src=\"/content/images/2026/04/anh1.jpg\" /><img src=\"/content/images/2026/04/anh2.jpg\" />",
      "tags": [{"name": "album"}],
      "feature_image": "/content/images/2026/04/anh1.jpg"
    }
  ]
}
```
