import './globals.css';

export const metadata = {
  title: 'DesignKit — UI Component Library',
  description: 'A premium, dark-first component library built for monorepos. Fully typed and accessible.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: 'hsl(222,28%,8%)' }}>
        {children}
      </body>
    </html>
  );
}
