import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const expectedUsername = process.env.ADMIN_USERNAME;
    const expectedPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    const token = process.env.AUTH_SECRET;

    if (!expectedUsername || !expectedPasswordHash || !token) {
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const hash = crypto.createHash('sha256').update(password).digest('hex');

    if (username === expectedUsername && hash === expectedPasswordHash) {
      return NextResponse.json({ success: true, token });
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
