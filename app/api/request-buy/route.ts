// app/api/request-buy/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

const TABLE = 'request_buy';

function extractLotId(url: string): string | null {
  try {
    const match = url.match(/\/lot\/(\d+)/i);
    if (match && match[1]) return match[1];

    const parts = url.split('/');
    const last = parts[parts.length - 1];
    if (/^\d+$/.test(last)) return last;

    return null;
  } catch {
    return null;
  }
}

// POST /api/request-buy  -> save a new buy request
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const full_name = body?.full_name ?? body?.name ?? null;
    const phone = body?.phone ?? null;
    const email = body?.email ?? null;
    const lot_url = body?.lot_url ?? body?.url ?? null;
    const notes = body?.notes ?? body?.message ?? null;

    if (!lot_url) {
      return NextResponse.json(
        { success: false, error: 'Missing lot_url / url in body' },
        { status: 400 },
      );
    }

    const lot_id = extractLotId(lot_url);

    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .insert({
        full_name,
        phone,
        email,
        lot_url,
        lot_id,
        notes,
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting request_buy:', error);
      return NextResponse.json(
        { success: false, error: error.message ?? 'Database error' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, request: data },
      { status: 201 },
    );
  } catch (err) {
    console.error('Server error in POST /api/request-buy:', err);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 },
    );
  }
}

// GET /api/request-buy  -> list all requests (for your admin dashboard)
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching request_buy:', error);
      return NextResponse.json(
        { ok: false, error: error.message ?? 'Database error' },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.error('Server error in GET /api/request-buy:', err);
    return NextResponse.json(
      { ok: false, error: 'Server error' },
      { status: 500 },
    );
  }
}
