import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from '@/app/libs/prismadb'
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function POST (req: Request){
    try {
        const currentUser = await getCurrentUser();
        const body = await req.json();
        const {
            userId,
            isGroup,
            members,
            name
        } = body;

        if(!currentUser?.id || !currentUser?.email){
            return new NextResponse('Unauthorized', {status : 401});
        }

        if(isGroup && (!members || members.length < 2 || !name)){
            return new NextResponse("Select atleast 2 member", {status : 400});
        }

        if(isGroup){     // for creating group chat
            const newConversation = await prisma.conversation.create({
                data:{
                    name,
                    isGroup,
                    user:{
                        connect:[
                            ...members.map((member:{value:string}) =>({
                                id:member.value
                            })),
                            {
                                id:currentUser.id
                            }
                        ]
                    }
                },
                include : {
                    user:true
                }
            })

            newConversation.user.forEach((user)=>{
                if(user.email){
                    pusherServer.trigger(user.email,'conversation:new', newConversation)
                }
            })
            return NextResponse.json(newConversation);
        }

        // for 1:1 chat --> first check if conversation exists or not
        const existingConversations = await prisma.conversation.findMany({
            where:{
                OR:[
                    {
                        userIds:{
                            equals:[currentUser.id, userId]
                        }
                    },
                    {
                        userIds:{
                            equals:[userId, currentUser.id]
                        }
                    }
                    
                ]
            }
        })
        const singleConversation = existingConversations[0];  // if 1:1 conv already exist
        if(singleConversation){
            return NextResponse.json(singleConversation);
        }

        const newConversation = await prisma.conversation.create({
            data:{
                user:{
                    connect:[
                        {
                            id:currentUser.id
                        },
                        {
                            id:userId
                        }
                    ]
                }
            },
            include:{
                user:true
            }
        })

        newConversation.user.map((user)=>{
            if(user.email){
                pusherServer.trigger(user.email,'conversation:new', newConversation)
            }
        })
        return NextResponse.json(newConversation)

    } catch (error:any) {
        return new NextResponse('Internal Error',{status : 500})
    }
}