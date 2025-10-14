
import "./globals.css";

export const metadata = {
  title: "Knowledge Base Search",
  description: "Chat with your documents.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
