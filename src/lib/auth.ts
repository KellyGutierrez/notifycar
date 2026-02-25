import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { db } from "@/lib/db"
import { compare } from "bcryptjs"

// Log para verificar que los modelos están cargados (ver en logs de Coolify)
console.log("🛠️ Prisma Models cargados:", Object.keys(db).filter(k => !k.startsWith("_")));

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db as any),
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/account/signin",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    role: "USER",
                }
            }
        }),
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
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id
                token.role = (user as any).role
                token.organizationId = (user as any).organizationId
                token.phonePrefix = (user as any).phonePrefix
                token.phoneNumber = (user as any).phoneNumber
                token.country = (user as any).country
            }
            // Para usuarios OAuth (Google), obtener el rol desde la BD
            if (account?.provider === "google" && token.email) {
                const dbUser = await db.user.findUnique({
                    where: { email: token.email },
                    select: { id: true, role: true, organizationId: true, phonePrefix: true, phoneNumber: true, country: true }
                })
                if (dbUser) {
                    token.id = dbUser.id
                    token.role = dbUser.role
                    token.organizationId = dbUser.organizationId
                    token.phonePrefix = dbUser.phonePrefix
                    token.phoneNumber = dbUser.phoneNumber
                    token.country = dbUser.country
                }
            }
            return token
        }
    }
}
