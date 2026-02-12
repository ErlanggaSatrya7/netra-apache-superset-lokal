import { NextResponse } from 'next/server';
import { TransactionService } from '../../services/transactionService'

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await TransactionService.importExcel(buffer);

        return NextResponse.json({ message: "Proses Selesai", data: result });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}