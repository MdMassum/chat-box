'use client'

import axios from "axios";
import AuthSocial from "@/app/components/AuthSocial";
import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import { useCallback, useEffect, useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { BsGithub, BsGoogle } from "react-icons/bs";
import toast from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {

    const session = useSession();
    const router = useRouter();
    const [variant, setVariant] = useState<Variant>('LOGIN')
    const [loading, setLoading] = useState(false);

    useEffect(()=>{

        if(session?.status === 'authenticated'){
            router.push('/users')
        }
    },[session?.status,router])

    const toggleVariant = useCallback(() => {
        setVariant((prevVariant) => 
            prevVariant === 'LOGIN' ? 'REGISTER' : 'LOGIN'
        );
    }, []);

    const {register,handleSubmit,formState:{errors}} = useForm<FieldValues>({
        defaultValues:{
            name : '',
            email:'',
            password:''
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = (data) =>{
        setLoading(true);

        
        if (variant === 'REGISTER') {

            // API call for register
            axios.post("/api/register", data)
            .then(()=>toast("Registered Successfully"))
            .then(()=> signIn('credentials', data))
            .catch((error : any)=>toast.error(error.response.data))
            .finally(()=>setLoading(false))
        }

        if (variant === 'LOGIN') {

            signIn('credentials',{
                ...data,
                redirect:false
            })
            .then((callback)=>{
                if(callback?.error){
                    toast.error(callback.error);
                }
                if(callback?.ok && !callback?.error){
                    toast.success("Login successful");
                    router.push('/users')
                }
            })
            .finally(()=>setLoading(false));
        }
    }

    const socialAction = (action : string) =>{
        // next auth social sign in
        setLoading(true);
        signIn(action,{redirect:false})
        .then((callback)=>{
            if(callback?.error){
                toast.error("Invalid Credentials");
            }
            if(callback?.ok && !callback?.error){
                toast.success("Login successful");
            }
        })
        .finally(()=>setLoading(false));
    }

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

                { variant === 'REGISTER' && (
                    <Input id="name" label="Name" errors={errors} register={register} disabled={loading}/>
                )}

                <Input id="email" label="Email" errors={errors} register={register} disabled={loading}/>

                <Input id="password" label="Password" errors={errors} register={register} disabled={loading}/>

                <div>
                    <Button
                     fullWidth
                     type="submit"
                     disabled={loading}
                     >{variant === 'LOGIN' ? "Sign in" : "Register"}
                     </Button>
                </div>

            </form>
            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"/>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500 ">
                            or continue with
                        </span>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex gap-2">
                <AuthSocial icon={BsGithub} onClick={() => socialAction('github')} />
                <AuthSocial icon={BsGoogle} onClick={() => socialAction('google')}/>
            </div>  

        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
            <div>
                {variant === "LOGIN" ? "New to ChatBox?" : "Already Have an Account?"}
            </div>
            <div
            onClick={toggleVariant}
            className="underline cursor-pointer">
                {variant === "LOGIN" ? "Create an Account" : "Login"}
            </div>
        </div>
        </div>

    </div>
  )
}

export default AuthForm