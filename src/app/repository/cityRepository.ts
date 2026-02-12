import { prisma } from "@/lib/prisma";

export const CityRepository = {

    async getCityIdByName(cityName: string) {
    try {
      const city = await prisma.city.findFirst({
        where: {
          city: {
            equals: cityName,
            mode: 'insensitive',
          },
        },
        select: {
          id_city: true, 
        },
      });

      return city?.id_city;
    } catch (error) {
      console.error("Gagal mengambil ID kota:", error);
      throw error;
    }
  },

}