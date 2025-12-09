import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();

    const { lat, lng } = await req.json();

    if (!lat || !lng) {
      return NextResponse.json(
        { error: "Missing lat or lng" },
        { status: 400 }
      );
    }

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = user.id; // ⭐ FIX: no more user.user.id

    // Update location
    const { data, error } = await supabase
      .from("shipping_drivers")
      .update({
        last_lat: lat,
        last_lng: lng,
        gps_device_id: `${lat},${lng}`,
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Location updated",
      driver: data,
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown server error";
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
