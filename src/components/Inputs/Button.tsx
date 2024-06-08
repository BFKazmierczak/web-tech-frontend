import { HTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  icon?: ReactNode
}

const Button = ({ children, icon, ...props }: ButtonProps) => {
  return (
    <button
      className=" relative flex justify-center items-center w-full 
        bg-violet-700 hover:bg-violet-800 active:bg-violet-900
        font-light text-white rounded-xl
        transition-all ease-in-out"
      {...props}>
      {icon && <div className=" absolute left-2">{icon}</div>}
      {children}
    </button>
  )
}

export default Button
