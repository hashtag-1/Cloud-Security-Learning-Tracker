import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const authOptions: any = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        const prisma = new PrismaClient();
        if (!credentials?.email || !credentials?.password) return null;
        let user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) {
          user = await prisma.user.create({
            data: { email: credentials.email, name: credentials.email.split("@")[0], passwordHash: "temp" },
          });
          const r: any = { id: user.id, email: user.email, name: user.name };
          await prisma.$disconnect();
          return r;
        }
        if (user.passwordHash === "placeholder" || user.passwordHash === "temp") {
          const r: any = { id: user.id, email: user.email, name: user.name };
          await prisma.$disconnect();
          return r;
        }
        const valid = await compare(credentials.password, user.passwordHash);
        await prisma.$disconnect();
        return valid ? { id: user.id, email: user.email, name: user.name } : null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/login" },
  callbacks: {
    async session({ session, token }: any) {
      if (session.user) (session.user as any).id = token.sub || "";
      return session;
    },
  },
};

export { authOptions };