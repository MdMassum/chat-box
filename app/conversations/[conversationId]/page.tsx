import getConversationsById from "@/app/actions/getConversationsById"
import getMessages from "@/app/actions/getMessages"
import EmptyState from "@/app/components/EmptyState"
import Header from "./components/Header"
import Body from "./components/Body"
import Form from "./components/Form"

interface iParams{
    conversationId : string
}

const ConversationId = async ({params}:{params:iParams}) =>{
    const conversation = await getConversationsById(params.conversationId)
    const messages = await getMessages(params.conversationId)

    if(!conversation){
        return(
            <div className="md:pl-80 h-screen">
                <div className="h-full flex flex-col">
                    <EmptyState/>
                </div>
            </div>
        )
    }
    return (
        <div className="md:pl-80 h-screen">
            <div className="h-full flex flex-col">
                <Header conversation={conversation} />
                <Body />
                <Form/>
            </div>
        </div>
    )
}
export default ConversationId