import { getTranslations } from "next-intl/server";
import TrainingCourses from "@/components/training/TrainingCourses";
import RegistrationForm from "@/components/training/RegistrationForm";

export const metadata = {
  title: "Đào tạo bồi dưỡng",
  description: "Các khóa đào tạo, bồi dưỡng về bảo tồn di sản văn hóa",
};

export default async function TrainingPage() {
  const t = await getTranslations("Training");

  return (
    <div className="training-page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">{t("title")}</h1>
          <p className="page-subtitle">{t("subtitle")}</p>
        </div>
      </div>

      <section className="training-intro">
        <div className="container">
          <div className="intro-content">
            <h2>{t("intro_title")}</h2>
            <p>{t("intro_desc")}</p>
          </div>
        </div>
      </section>

      <section className="training-courses">
        <div className="container">
          <TrainingCourses />
        </div>
      </section>

      <section className="registration-section">
        <div className="container">
          <div className="section-header">
            <h2>{t("register_title")}</h2>
            <p>{t("register_desc")}</p>
          </div>
          <RegistrationForm />
        </div>
      </section>
    </div>
  );
}
