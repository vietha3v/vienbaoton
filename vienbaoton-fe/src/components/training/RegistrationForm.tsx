"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const courses = [
  { id: "1", name: "Kỹ thuật tu bổ di tích gỗ" },
  { id: "2", name: "Bảo tồn di sản văn hóa phi vật thể" },
  { id: "3", name: "Số hóa di sản bằng công nghệ 3D" },
  { id: "4", name: "Quản lý dự án bảo tồn" },
  { id: "5", name: "Phục chế hiện vật gốm sứ" },
  { id: "6", name: "Khảo sát & đánh giá di tích" },
];

export default function RegistrationForm() {
  const t = useTranslations("Training");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    position: "",
    courseId: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Registration submitted:", formData);
    setIsSubmitting(false);
    setSubmitted(true);

    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        organization: "",
        position: "",
        courseId: "",
        message: "",
      });
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="form-success">
        <div className="success-icon">✓</div>
        <h3>{t("form_success_title")}</h3>
        <p>{t("form_success_message")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="registration-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="fullName">{t("form_name_label")} *</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder={t("form_name_placeholder")}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">{t("form_email_label")} *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t("form_email_placeholder")}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="phone">{t("form_phone_label")} *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder={t("form_phone_placeholder")}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="organization">{t("form_org_label")}</label>
          <input
            type="text"
            id="organization"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            placeholder={t("form_org_placeholder")}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="position">{t("form_position_label")}</label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            placeholder={t("form_position_placeholder")}
          />
        </div>

        <div className="form-group">
          <label htmlFor="courseId">{t("form_course_label")} *</label>
          <select
            id="courseId"
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            required
          >
            <option value="">{t("form_course_select")}</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group full-width">
        <label htmlFor="message">{t("form_message_label")}</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder={t("form_message_placeholder")}
          rows={4}
        />
      </div>

      <div className="form-submit">
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? t("form_submitting") : t("form_submit")}
        </button>
      </div>
    </form>
  );
}
