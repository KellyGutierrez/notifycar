import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { db } from "@/lib/db"
import { compare } from "bcryptjs"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/account/signin",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }
                const user = await db.user.findUnique({
                    where: { email: credentials.email }
                })
                if (!user || !user.password) {
                    return null
                }
                const isPasswordValid = await compare(credentials.password, user.password)
                if (!isPasswordValid) return null

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    organizationId: user.organizationId,
                    phonePrefix: user.phonePrefix,
                    phoneNumber: user.phoneNumber,
                    country: user.country
                }
            }
        })
    ],
    callbacks: {
        async session({ token, session }) {
            if (token) {
                if (session.user) {
                    session.user.id = token.id as string
                    session.user.name = token.name
                    session.user.email = token.email
                    session.user.role = token.role as any
                    session.user.organizationId = token.organizationId as string | null
                    session.user.phonePrefix = token.phonePrefix as string | null
                    session.user.phoneNumber = token.phoneNumber as string | null
                    session.user.country = token.country as string | null
                }
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.organizationId = user.organizationId
                token.phonePrefix = (user as any).phonePrefix
                token.phoneNumber = (user as any).phoneNumber
                token.country = (user as any).country
            }
            return token
        }
    }
}
