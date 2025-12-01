// app/api/admin/displays/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// GET - Fetch all displays (admin only)
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = await verifyToken(token);

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Fetch all displays with user information
    const { data: displays, error } = await supabase
      .from('displays')
      .select(`
        *,
        user:users!displays_user_id_fkey (
          id,
          email,
          business_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching displays:', error);
      return NextResponse.json(
        { error: 'Failed to fetch displays' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      displays: displays || [],
    });
  } catch (error) {
    console.error('Get displays error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

