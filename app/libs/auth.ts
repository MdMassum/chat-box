import bcrypt from 'bcrypt'
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from './prismadb'
import { AuthOptions } from 'next-auth';

export const authOptions : AuthOptions = {

    adapter: PrismaAdapter(prisma),
    providers : [
        GithubProvider({   // get credentials from github
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),

        GoogleProvider({   // get credentials from google
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string
        }),

        CredentialsProvider({
            name : 'credentials',
            credentials:{
                email:{label:'email', type:'text'},
                password:{label:'password', type:'password'}
            },

            async authorize(credentials){
                if(!credentials?.email || !credentials?.password){
                    throw new Error('Invalid Credentials');
                }

                const user = await prisma.user.findUnique({
                    where:{
                        email:credentials.email
                    }
                })
                // when user not found or oauth user trying to login using login form
                if(!user || !user?.hashedPassword){    
                    throw new Error('Invalid Credentials')
                }

                const isCorrectPassword = await bcrypt.compare(credentials.password, user.hashedPassword);
                if(!isCorrectPassword){
                    throw new Error('Invalid Credentials')
                }
                return user;
            }
        })
    ],
    debug : process.env.NODE_ENV === 'development',
    session: {
        strategy:'jwt',
    },
    secret : process.env.NEXTAUTH_SECRET,
}