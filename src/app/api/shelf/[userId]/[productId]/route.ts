import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function DELETE(request: Request, { params }: { params: { userId: string, productId: string } }) {
    const { userId, productId } = params;
    try {
        await pool.query('DELETE FROM user_products WHERE id = $1 AND userId = $2', [productId, userId]);
        return NextResponse.json({ message: 'Product deleted successfully.' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to delete product.' }, { status: 500 });
    }
}
