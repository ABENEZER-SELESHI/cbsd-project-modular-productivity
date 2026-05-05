import './globals.css';

export const metadata = {
  title: 'Productivity Hub',
  description: 'A full-stack monorepo app for managing tasks, habits, and notes.',
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
