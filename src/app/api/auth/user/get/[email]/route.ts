import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { email: string } }) {
    const { email } = params;

    if (!email) {
        return NextResponse.json({ message: 'Id is required' }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                email,
            }
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
