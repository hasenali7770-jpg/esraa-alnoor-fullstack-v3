interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className = "" }: ContainerProps) {
  const baseClasses = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";
  const combinedClasses = className 
    ? `${baseClasses} ${className}`.replace(/\s+/g, ' ').trim()
    : baseClasses;
  
  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
}
