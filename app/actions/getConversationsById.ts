import prisma from '@/app/libs/prismadb'
import getCurrentUser from './getCurrentUser';

const getConversationsById = async(conversationId : string) =>{
    try {
        const currentUser = await getCurrentUser();
        if(!currentUser?.email){

        }

        const conversation = await prisma.conversation.findUnique({
            where:{
                id:conversationId
            },
            include:{
                user:true
            }
        })

        return conversation
    } catch (error:any) {
        return null;
    }
}

export default getConversationsById