import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';

interface Iparams {
    conversationId?: string;
}

export async function DELETE(
    req: Request,
    { params }: { params: Iparams }
) {
    try {
        const { conversationId } = params;
        const currentUser = await getCurrentUser();

        // Check if the user is authenticated
        if (!currentUser?.id || !currentUser?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const existingConversation = await prisma.conversation.findUnique({
            where:{
                id:conversationId
            },
            include:{
                user:true
            }
        })

        if(!existingConversation){
            return new NextResponse("Invalid Id", {status:400});
        }

        const deletedConversation = await prisma.conversation.deleteMany({
            where:{
                id:conversationId,
                userIds:{
                    hasSome:[currentUser.id]
                }
            }
        })

        return NextResponse.json(deletedConversation);
        
    } catch (error: any) {
        console.error("ERROR_CONV_DELETE", error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
