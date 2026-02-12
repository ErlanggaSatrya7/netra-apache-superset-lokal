import { prisma } from "@/lib/prisma";

export const stateRepository = {

    async getStateIdByName(stateName: string) {
    try {
      const state = await prisma.state.findFirst({
        where: {
          state: {
            equals: stateName,
            mode: 'insensitive',
          },
        },
        select: {
          id_state: true, 
        },
      });

      return state?.id_state;
    } catch (error) {
      console.error("Gagal mengambil ID kota:", error);
      throw error;
    }
  },

}