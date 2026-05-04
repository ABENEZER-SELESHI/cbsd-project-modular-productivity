export const metadata = {
  title: 'Monorepo App',
  description: 'Task Manager & Habit Tracker',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: '2rem', background: '#f9fafb' }}>
        {children}
      </body>
    </html>
  );
}
