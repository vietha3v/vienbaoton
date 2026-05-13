import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || "";

interface GhostWebhookResource {
  id: string;
  slug: string;
  title?: string;
  featured?: boolean;
  tags?: { slug: string }[];
}

interface GhostWebhookPayload {
  post?: { current?: GhostWebhookResource };
  page?: { current?: GhostWebhookResource };
}

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const body: GhostWebhookPayload = await request.json();
    const resource = body.post?.current || body.page?.current;

    if (!resource || !resource.slug) {
      return NextResponse.json(
        { message: "No resource slug found" },
        { status: 400 }
      );
    }

    const { slug, featured, tags } = resource;
    const type = body.post ? "post" : "page";
    const pathsRevalidated: string[] = [];

    // Revalidate the specific post/page
    await revalidatePath(`/${slug}`);
    pathsRevalidated.push(`/${slug}`);

    // Revalidate homepage if featured or if it's a post (homepage shows latest posts)
    if (featured || type === "post") {
      await revalidatePath("/");
      pathsRevalidated.push("/");
    }

    // Revalidate tag pages if tags changed
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        await revalidatePath(`/tag/${tag.slug}`);
        pathsRevalidated.push(`/tag/${tag.slug}`);
      }
    }

    return NextResponse.json({
      revalidated: true,
      slug,
      type,
      paths: pathsRevalidated,
    });
  } catch (error) {
    console.error("[Revalidate] Error:", error);
    return NextResponse.json(
      { message: "Revalidation failed" },
      { status: 500 }
    );
  }
}
