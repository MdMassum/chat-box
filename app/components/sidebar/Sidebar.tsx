import React from 'react'
import DesktopSidbar from './DesktopSidebar'
import MobileFooter from './MobileFooter'
import getCurrentUser from '@/app/actions/getCurrentUser'

async function Sidebar({children}:{children:React.ReactNode}) {

  const currentUser = await getCurrentUser();
  return (
    <div className='h-full'>

        <DesktopSidbar currentUser={currentUser!}/>  {/* !means it can be null also */}
        <MobileFooter/>
        <main className='md:pl-20 h-full'>
        {children}
        </main>
    </div>
  )
}

export default Sidebar