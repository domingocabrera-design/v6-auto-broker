import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

const LOTS_TABLE = 'lots';

// Helper to extract Copart lot ID from a URL.
// Example URL: https://www.copart.com/lot/58046565
function extractLotId(url: string): string | null {
  try {
    // Try to find "/lot/{numbers}" in the URL
    const match = url.match(/\/lot\/(\d+)/i);
    if (match && match[1]) return match[1];

    // Fallback: just return the last numeric chunk
    const parts = url.split('/');
    const last = parts[parts.length - 1];
    if (/^\d+$/.test(last)) return last;

    return null;
  } catch {
    return null;
  }
}

// POST /api/lots  -> save a lot based on a Copart URL
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const url = body?.url as string | undefined;

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'Missing "url" in body' },
        { status: 400 },
      );
    }

    const lotId = extractLotId(url);

    if (!lotId) {
      return NextResponse.json(
        { success: false, error: 'Lot ID not found in URL' },
        { status: 400 },
      );
    }

    // Insert into Supabase
    const { data, error } = await supabaseAdmin
      .from(LOTS_TABLE)
      .insert({ lot_id: lotId, url })
      .select()
      .single();

    if (error) {
      console.error('Error inserting lot:', error);
      return NextResponse.json(
        { success: false, error: error.message ?? 'Database error' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        lot: data,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error('Server error in POST /api/lots:', err);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 },
    );
  }
}

// GET /api/lots  -> list all saved lots
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from(LOTS_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching lots:', error);
      return NextResponse.json(
        { ok: false, error: error.message ?? 'Database error' },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.error('Server error in GET /api/lots:', err);
    return NextResponse.json(
      { ok: false, error: 'Server error' },
      { status: 500 },
    );
  }
}
