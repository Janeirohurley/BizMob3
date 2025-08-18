import React, { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showHeader?: boolean;
}

export function MainLayout({ 
  children, 
  title, 
  description, 
  showHeader = true 
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative">
      {showHeader && (
        <header className="bg-white shadow-sm p-4 text-center">
          {title && <h1 className="text-gray-800">{title}</h1>}
          {description && <p className="text-gray-600 text-sm">{description}</p>}
        </header>
      )}
      <main className={showHeader ? "pb-20" : "min-h-screen"}>
        {children}
      </main>
    </div>
  );
}