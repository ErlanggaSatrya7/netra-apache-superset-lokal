import { prisma } from "@/lib/prisma";

export const RetailerRepository = {

    async getRetailerIdByName(retailerName: string) {
    try {
      const retailer = await prisma.retailer.findFirst({
        where: {
          retailer_name: {
            equals: retailerName,
            mode: 'insensitive',
          },
        },
        select: {
          id_retailer: true, 
        },
      });

      return retailer?.id_retailer;
    } catch (error) {
      console.error("Gagal mengambil ID retailer:", error);
      throw error;
    }
  },

}