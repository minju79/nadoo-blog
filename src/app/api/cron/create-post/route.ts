import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");

        // Security check
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, content, thumbnail_url, published = true } = await req.json();

        if (!title || !content) {
            return NextResponse.json({ error: "Missing title or content" }, { status: 400 });
        }

        // Generate slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "")
            + "-" + Date.now().toString().slice(-4);

        // Use service role key for admin access
        const supabase = supabaseAdmin(process.env.SUPABASE_SERVICE_ROLE_KEY!);

        const { data, error } = await supabase
            .from("posts")
            .insert([
                {
                    title,
                    slug,
                    content,
                    thumbnail_url,
                    published,
                },
            ])
            .select()
            .single();

        if (error) {
            console.error("Supabase Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, post: data });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
