'use client'

import useConversation from "../hooks/useConversation"
import EmptyState from "../components/EmptyState"
import clsx from "clsx"

const Home = () =>{

    const {isOpen} = useConversation()
    return(

        <div className={clsx("md:pl-80 h-full md:block", isOpen ? 'block' : 'hidden')}>
            <EmptyState/>
        </div>
    )
}

export default Home