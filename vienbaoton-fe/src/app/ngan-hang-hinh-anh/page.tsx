import { getTranslations } from "next-intl/server";
import SectionHeader from "@/components/shared/SectionHeader";
import AlbumGallery from "@/components/gallery/AlbumGallery";
import { getAlbums } from "@/lib/ghost";

export const metadata = {
  title: "Ngân hàng hình ảnh",
  description: "Thư viện hình ảnh về các hoạt động bảo tồn di sản văn hóa",
};

export default async function ImageGalleryPage() {
  const t = await getTranslations("Gallery");
  const albums = await getAlbums();

  return (
    <div className="gallery-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">{t("title")}</h1>
          <p className="page-subtitle">{t("subtitle")}</p>
        </div>
      </div>

      <section className="gallery-section">
        <div className="container">
          <AlbumGallery albums={albums} />
        </div>
      </section>
    </div>
  );
}
