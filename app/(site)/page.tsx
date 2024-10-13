import Image from "next/image"
import logo from '../assets/messenger.png'
import AuthForm from "./components/AuthForm"

function Home() {
  return (
    <div 
    className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-100">
        <div
        className="sm:mx-auto sm:w-full sm:max-w-md">
            <Image alt='logo' height="48" width="48" className='mx-auto w-auto rounded-full'
            src={logo}></Image>

            <h2 className="font-robotoSerif mt-6 text-center text-4xl font-bold tracking-tight text-gray-900">Sign In to Your Account</h2>
        </div> 

        {/* authform */}
        <AuthForm/>
    </div>
  )
}

export default Home