import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ALLOWED_ORIGINS = [
  "http://localhost:2368",
  "http://127.0.0.1:2368",
  process.env.GHOST_API_URL || "",
].filter(Boolean);

function corsResponse(body: unknown, status = 200, origin: string | null = null) {
  const allowed =
    origin && ALLOWED_ORIGINS.some((o) => origin.startsWith(o.replace(/\/$/, "")))
      ? origin
      : ALLOWED_ORIGINS[0] || "*";
  return NextResponse.json(body, {
    status,
    headers: {
      "Access-Control-Allow-Origin": allowed,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

const DATA_FILE = path.join(process.cwd(), "data", "training-registrations.json");

interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  position: string;
  course: string;
  message: string;
  created_at: string;
}

function readRegistrations(): Registration[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function saveRegistration(reg: Registration) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const data = readRegistrations();
  data.push(reg);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function OPTIONS(request: NextRequest) {
  return corsResponse(null, 204, request.headers.get("origin"));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { name, email, phone, org, position, course, message } = body;

    if (!name || !email) {
      return corsResponse({ error: "Vui lòng điền họ tên và email" }, 400);
    }

    const registration: Registration = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name,
      email,
      phone: phone || "",
      organization: org || "",
      position: position || "",
      course: course || "",
      message: message || "",
      created_at: new Date().toISOString(),
    };

    saveRegistration(registration);

    return corsResponse({ success: true, id: registration.id });
  } catch (error) {
    console.error("[Training Register] Error:", error);
    return corsResponse({ error: "Đăng ký thất bại, vui lòng thử lại" }, 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const data = readRegistrations();
    return corsResponse({ registrations: data }, 200);
  } catch {
    return corsResponse({ error: "Không thể đọc dữ liệu" }, 500);
  }
}
