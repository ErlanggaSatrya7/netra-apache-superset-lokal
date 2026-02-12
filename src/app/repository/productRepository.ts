import { prisma } from "@/lib/prisma";

export const ProductRepository = {

    async getProductIdByName(productName: string) {
    try {
      const product = await prisma.product.findFirst({
        where: {
          product: {
            equals: productName,
            mode: 'insensitive',
          },
        },
        select: {
          id_product: true, 
        },
      });

      return product?.id_product;
    } catch (error) {
      console.error("Gagal mengambil ID kota:", error);
      throw error;
    }
  },

}