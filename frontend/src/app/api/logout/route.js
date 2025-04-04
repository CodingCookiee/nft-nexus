import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const sessionOptions ={
    cookieName: 'siwe',
    password: process.env.NEXT_IRON_SESSION_PASSWORD,
    cookieOptions:{
        secure: process.env.NODE_ENV === 'production',
    },
}

export async function GET() {
    const session = await getIronSession(cookies(), sessionOptions);

    session.destroy();

    return NextResponse.json({
        ok: true,
        message: 'Logged out successfully',
    });
}