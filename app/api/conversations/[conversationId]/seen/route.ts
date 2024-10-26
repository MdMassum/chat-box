import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';

interface Iparams {
    conversationId?: string;
}

export async function POST(
    req: Request,
    { params }: { params: Iparams }
) {
    try {
        const currentUser = await getCurrentUser();

        // Check if the user is authenticated
        if (!currentUser?.id || !currentUser?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { conversationId } = params;
        if (!conversationId) {
            return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 });
        }

        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                messages: {
                    include: { seen: true },
                },
                user: true,
            },
        });


        if (!conversation) {
            return NextResponse.json({ error: "Invalid conversation ID" }, { status: 400 });
        }

        const lastMessage = conversation.messages?.[conversation.messages.length - 1];


        if (!lastMessage) {
            return NextResponse.json(conversation);
        }

        const updatedMessage = await prisma.message.update({
            where: { id: lastMessage.id },
            include: {
                sender: true,
                seen: true,
            },
            data: {
                seen: {
                    connect: { id: currentUser.id },
                },
            },
        });


        return NextResponse.json(updatedMessage);
    } catch (error: any) {
        console.error("ERROR_MESSAGE_SEEN", error);
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
