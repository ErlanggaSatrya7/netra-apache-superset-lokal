import { prisma } from "@/lib/prisma";

export const MethodRepository = {

    async getMethodIdByName(methodName: string) {
    try {
      const method = await prisma.method.findFirst({
        where: {
          method: {
            equals: methodName,
            mode: 'insensitive',
          },
        },
        select: {
          id_method: true, 
        },
      });

      return method?.id_method;
    } catch (error) {
      console.error("Gagal mengambil ID kota:", error);
      throw error;
    }
  },

}