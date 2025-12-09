// app/api/login/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

const ADMINS_TABLE = 'admins';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = body?.email?.toLowerCase().trim();
    const password = body?.password;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 },
      );
    }

    const { data: admin, error } = await supabaseAdmin
      .from(ADMINS_TABLE)
      .select('id, email, password')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Error querying admins:', error);
      return NextResponse.json(
        { success: false, error: 'Database error' },
        { status: 500 },
      );
    }

    if (!admin) {
      // No admin with that email
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    // TEMP: plain-text compare (we’ll swap for hashed later)
    if (admin.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    // For now just return success + basic info (no real session token yet)
    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error('Server error in POST /api/login:', err);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 },
    );
  }
}
