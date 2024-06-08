import { DetailedHTMLProps, ReactNode } from 'react'

interface InputProps
  extends DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}

const Input = ({ ...props }: InputProps) => {
  return (
    <input
      className=" font-light px-2 bg-violet-900 w-full rounded-xl"
      {...props}
    />
  )
}

export default Input
