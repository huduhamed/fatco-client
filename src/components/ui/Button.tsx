import { Link, type LinkProps } from 'react-router-dom'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
type Props=ButtonHTMLAttributes<HTMLButtonElement>&{variant?:'primary'|'secondary'|'ghost'}
export function Button({variant='primary',className='',...props}:Props){return <button className={`btn btn-${variant} ${className}`} {...props}/>} 
export function ButtonLink({variant='primary',className='',children,...props}:LinkProps&{variant?:'primary'|'secondary'|'ghost';children:ReactNode}){return <Link className={`btn btn-${variant} ${className}`} {...props}>{children}</Link>}
