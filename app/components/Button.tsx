import clsx from "clsx";

interface btnProps {

  type ?: 'button' | 'submit' | 'reset' | undefined;
  fullWidth ?: boolean;
  children ?: React.ReactNode;
  onClick?: ()=>{};
  disabled ?: boolean;
  secondary ?: boolean;
  danger ?: boolean;
  
}
const Button:React.FC<btnProps> = ({type, fullWidth, children, onClick, disabled, secondary, danger})=> {
  return (
    <button 
      onClick={onClick}
      type={type}
      disabled={disabled}

      className={clsx(`flex justify-center rounded-md px-3 py-2 text-sm font-semibold focus-visible:outlinefocus-visible:outline-2 focus-visible:outline-offset-2`,
      disabled && "opacity-50 cursor-default",
      fullWidth && "w-full",
      secondary ? "text-gray-900" : "text-white",
      danger && "bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600",
      !secondary && !danger && "bg-gradient-to-l from-purple-400 to-purple-900  hover:opacity-95 focus-visible:outline-purple-600")}
        
    >{children}</button>
  )
}

export default Button