import type { Program } from "../../generated/prisma/client.js";
import prisma from "../../utils/prisma.js";

class ProgramRepository {
    public async findById(id : string): Promise<Program | null>{
        return prisma.program.findUnique({where : {id}})
    }
}

export const programRepository = new ProgramRepository();