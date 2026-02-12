// import {transactionRepository} from '../repository/transaction'
import { TransactionRepository } from '../repository/transactionRepository';
import { InputTransaction} from '../models/transaction';
import { Transaction} from '../models/transaction';
import { RetailerRepository } from '../repository/retailerRepository';
import { CityRepository } from '../repository/cityRepository'; 
import { ProductRepository } from '../repository/productRepository';
import { MethodRepository } from '../repository/methodRepository'; 
import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';


export const TransactionService = {

    async addTransaction(transaction : InputTransaction){

        try {
            const idRetailer = await RetailerRepository.getRetailerIdByName(transaction.retailer)
            const idCity = await CityRepository.getCityIdByName(transaction.city)
            const idMethod = await MethodRepository.getMethodIdByName(transaction.method)
            const idProduct = await ProductRepository.getProductIdByName(transaction.product)


            if (!idRetailer || !idCity || !idMethod || !idProduct) {
                return 'Salah satu referensi data (Retailer/City/Method/Product) tidak ditemukan';
            }


            const transactionRepo : Transaction = {
                id_retailer: Number(idRetailer),
                id_city : Number(idCity),
                id_method : Number(idMethod),
                id_product : Number(idProduct),
                unit_sold : transaction.unit_sold,
                invoice_date : transaction.invoice_date,
                operating_margin : transaction.operating_margin,
                operating_profit : transaction.operating_profit,
                price_per_unit : transaction.price_per_unit,
                total_sales : transaction.total_sales
            }

            return await TransactionRepository.insertTransaction(transactionRepo)
            // return NextResponse.json(
            //     { message: transactionRepo }, 
            //     { status: 200 }
            //     )
        }catch(error){
            throw error
        }
    },

    async importExcel(fileBuffer: Buffer) {
    try {
        // 1. Baca dengan cellDates agar tanggal tidak jadi angka 43831
        const workbook = XLSX.read(fileBuffer, { type: 'buffer', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        // raw: false agar data dibaca sebagai string yang sudah terformat
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: false }) as any[];

        const finalDataToInsert: Transaction[] = [];
        const errorLogs: string[] = [];

        for (const row of rows) {
            // MAPPING HARUS SAMA PERSIS DENGAN HEADER EXCEL (Besar/Kecil & Spasi)
            const [idRetailer, idCity, idMethod, idProduct] = await Promise.all([
                // retailer.selectRetailer(row['Retailer']),
                RetailerRepository.getRetailerIdByName(row['Retailer']),
                // city.selectCity(row['City']),
                CityRepository.getCityIdByName(row['City']),
                // method.selectMethod(row['Sales Method']),
                MethodRepository.getMethodIdByName(row['Sales Method']),
                // product.selectProduct(row['Product']),
                ProductRepository.getProductIdByName(row['Product'])
            ]);

            // Cek apakah ada referensi yang gagal ditemukan
            if (!idRetailer || !idCity || !idMethod || !idProduct) {
                errorLogs.push(`Gagal: Retailer(${row['Retailer']}), City(${row['City']}) - Referensi tak ditemukan`);
                continue; 
            }

            finalDataToInsert.push({
                id_retailer: Number(idRetailer),
                id_city: Number(idCity),
                id_method: Number(idMethod),
                id_product: Number(idProduct),
                unit_sold: Number(row['Units Sold']),
                invoice_date: row['Invoice Date'], // Tanggal sekarang aman
                operating_margin: Number(row['Operating Margin']),
                operating_profit: Number(row['Operating Profit']),
                price_per_unit: Number(row['Price per Unit']),
                total_sales: Number(row['Total Sales'])
            });
        }

        // 2. Lakukan Bulk Insert sekaligus
        if (finalDataToInsert.length > 0) {
            // Pastikan repository.insertTransaction menerima array Transaction[]
            const result = await TransactionRepository.insertManyTransactions(finalDataToInsert);
            // if (result?.error) throw new Error(result.error.message);
        }

        return { 
            successCount: finalDataToInsert.length, 
            errorCount: errorLogs.length, 
            details: errorLogs.slice(0, 10) 
        };

    } catch (error: any) {
        console.error("Kesalahan di Service:", error.message);
        throw error;
    }
}






}