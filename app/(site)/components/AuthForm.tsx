'use client'

import AuthSocial from "@/app/components/AuthSocial";
import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import { useCallback, useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { BsGithub, BsGoogle } from "react-icons/bs";

type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {

    const [variant, setVariant] = useState<Variant>('LOGIN')
    const [loading, setLoading] = useState(false);

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

    //     try {
    //         if (variant === 'REGISTER') {
    //             // Make an API call for register
    //             const response = await axios.post("/api/register", data);
    //             console.log("Registration successful:", response.data);
    //         }
    //         if (variant === 'LOGIN') {
    //             // Make an API call for login
    //             const response = await axios.post("/api/login", data);
    //             console.log("Login successful:", response.data);
    //         }
    //     } catch (error) {
    //         console.error("Error during authentication:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    }

    const socialAction = (action : string) =>{
        setLoading(true);
        // next auth social sign in
    }

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

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
                <AuthSocial icon={BsGithub}  />
                <AuthSocial icon={BsGoogle} />
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