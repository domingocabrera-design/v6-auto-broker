// app/api/test/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('test_connection')
    .select('*');

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message ?? error },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, data });
}
