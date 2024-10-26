import bcrypt from 'bcrypt'
import prisma from '@/app/libs/prismadb'
import { NextResponse } from 'next/server'
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function POST(req:Request) {
    try {

        const currentUser = await getCurrentUser();
        const body = await req.json();
        const{name, profilePicture} = body;

        if(!currentUser?.id){
            return new NextResponse('Unauthorized',{status:401})
        }
        
        const updatedUser = await prisma.user.update({
            where:{
                id:currentUser.id,
            },
            data:{
                name:name,
                image:profilePicture
            }
        })
        return NextResponse.json(updatedUser);
    } catch (error) {
        console.log(error, 'PROFILE_UPDATE_ERROR')
        return new NextResponse('Internal Error', {status:500})
    }
}