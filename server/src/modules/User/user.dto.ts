import type { UserStatus } from "../../generated/prisma/enums.js";

export interface CureentUserDto{
    id? : string | undefined,
}

export interface updateUserProfileDto{
    firstName? : string,
    lastName? : string,
    phone? : string,
    avatar? : string,
}

export interface updateUserPasswordDto{
    currentPassword : string,
    newPassword : string,
}

export interface getAllUsersDto{
    page : number,
    limit : number,
}
export interface getUserByIdDto{
    id : string,
}

export interface updateStatusDto{
    id : string,
    status : UserStatus,
}