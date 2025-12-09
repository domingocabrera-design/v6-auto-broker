// app/api/signup/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

const TABLE = 'signups';

// POST /api/signup  -> save a new signup / lead
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const full_name = body?.full_name ?? body?.name ?? null;
    const email = body?.email ?? null;
    const phone = body?.phone ?? null;
    const country = body?.country ?? null;
    const note = body?.note ?? body?.message ?? null;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .insert({
        full_name,
        email,
        phone,
        country,
        note,
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting signup:', error);
      return NextResponse.json(
        { success: false, error: error.message ?? 'Database error' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, signup: data },
      { status: 201 },
    );
  } catch (err) {
    console.error('Server error in POST /api/signup:', err);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 },
    );
  }
}

// GET /api/signup  -> list all signups (for your admin dashboard)
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching signups:', error);
      return NextResponse.json(
        { ok: false, error: error.message ?? 'Database error' },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    console.error('Server error in GET /api/signup:', err);
    return NextResponse.json(
      { ok: false, error: 'Server error' },
      { status: 500 },
    );
  }
}
