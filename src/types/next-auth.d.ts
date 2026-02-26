import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: string
            organizationId?: string | null
            phonePrefix?: string | null
            phoneNumber?: string | null
            country?: string | null
            phoneVerified?: Date | null
        } & DefaultSession["user"]
    }

    interface User {
        id: string
        role: string
        organizationId?: string | null
        phonePrefix?: string | null
        phoneNumber?: string | null
        country?: string | null
        phoneVerified?: Date | null
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: string
        organizationId?: string | null
        phonePrefix?: string | null
        phoneNumber?: string | null
        country?: string | null
        phoneVerified?: Date | null
    }
}
