import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement>{
    children: ReactNode,
    disabled?: boolean
}

export default function Button({ children, ...props }: ButtonProps) {
    return (
        <button
            role="button"
            className="button"
            {...props}
        >
            {children}
        </button>
    )
}