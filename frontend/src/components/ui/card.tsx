import React from 'react';
export function Card({children,className=''}:{children:React.ReactNode;className?:string}){return <div className={'rounded-xl2 border border-[color:var(--border)] bg-[color:var(--card)] '+className}>{children}</div>;}
