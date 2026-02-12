import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
// import { PrismaClient } from '@prisma/client/extension';
// import { PrismaClient } from '@/app/generated/prisma/internal/class';
// import { PrismaClient } from '@/generated/prisma/internal/class';
import { TransactionService } from '@/app/services/transactionService';
import { InputTransaction } from '@/app/models/transaction';

const prisma = new PrismaClient();

export async function POST(request :Request) {
  try {
    // Mengambil data dari body request
    const body = await request.json();
    
    const { 
      retailer, product, method, city, 
      invoice_date, price_per_unit, unit_sold, 
      total_sales, operating_profit, operating_margin 
    } = body;


    const dataInput : InputTransaction = {
        retailer : retailer,
        product : product,
        method : method,
        city : city,
        invoice_date : invoice_date,
        price_per_unit : price_per_unit,
        unit_sold : unit_sold,
        total_sales : total_sales,
        operating_profit : operating_profit,
        operating_margin : operating_margin
    }

    // Proses insert ke database menggunakan Prisma
    // const newTransaction = await prisma.transaction.create({
    //   data: {
    //     id_retailer: Number(id_retailer),
    //     id_product: Number(id_product),
    //     id_method: Number(id_method),
    //     id_city: Number(id_city),
    //     invoice_date: new Date(invoice_date),
    //     price_per_unit: parseFloat(price_per_unit),
    //     unit_sold: parseInt(unit_sold),
    //     total_sales: parseFloat(total_sales),
    //     operating_profit: parseFloat(operating_profit),
    //     operating_margin: parseFloat(operating_margin),
    //   },
    // });

    const newTransaction = await TransactionService.addTransaction(dataInput)

    return NextResponse.json({
      message: "Transaksi berhasil dicatat!",
      data: newTransaction
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ 
      error: "Gagal memproses transaksi", 
    }, { status: 500 });
  }
}