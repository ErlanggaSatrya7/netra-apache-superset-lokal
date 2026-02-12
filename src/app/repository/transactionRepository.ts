import { prisma } from "@/lib/prisma";
import { Transaction } from "../models/transaction";


export const TransactionRepository = {

    async insertTransaction(dataTransaction : Transaction){

        try {
            return await prisma.transaction.create({
            data :{
                id_retailer : dataTransaction.id_retailer?? 0,
                id_product : dataTransaction.id_product?? 0,
                id_method : dataTransaction.id_method?? 0,
                id_city : dataTransaction.id_city?? 0,
                // invoice_date : dataTransaction.invoice_date,
                invoice_date: new Date(dataTransaction.invoice_date),
                price_per_unit : dataTransaction.price_per_unit,
                unit_sold : dataTransaction.unit_sold,
                total_sales : dataTransaction.total_sales,
                operating_margin : dataTransaction.operating_margin,
                operating_profit : dataTransaction.operating_profit
            }
        })
        }catch (error: any) {
            console.error("Kesalahan di Service:", error.message);
            throw error;
        }
        
    },



    // FUNGSI BARU: Untuk insert banyak data sekaligus (Bulk Insert)
    async insertManyTransactions(dataTransactions: Transaction[]) {
        try {
            return await prisma.transaction.createMany({
                data: dataTransactions.map(item => ({
                    id_retailer : item.id_retailer?? 0,
                    id_product : item.id_product?? 0,
                    id_method : item.id_method?? 0,
                    id_city : item.id_city?? 0,
                    // invoice_date : item.invoice_date,
                    invoice_date: new Date(item.invoice_date),
                    price_per_unit : item.price_per_unit,
                    unit_sold : item.unit_sold,
                    total_sales : item.total_sales,
                    operating_margin : item.operating_margin,
                    operating_profit : item.operating_profit
                })),
                // skipDuplicates: true,
            });
        } catch (error: any) {
            console.error("Error Bulk Insert:", error.message);
            throw error;
        }
    }
}

