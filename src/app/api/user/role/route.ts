import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json({ message: 'Server not configured' }, { status: 500 });
  }

  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('sb-access-token')?.value || cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ role: 'USER' }, { status: 200 });
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(sessionCookie);
    if (error || !user) {
      return NextResponse.json({ role: 'USER' }, { status: 200 });
    }

    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    return NextResponse.json({ role: userData?.role || 'USER' }, { status: 200 });

  } catch (error) {
    console.error('Error fetching user role:', error);
    return NextResponse.json({ role: 'USER' }, { status: 200 });
  }
}
