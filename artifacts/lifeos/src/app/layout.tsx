import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

    icon: "/logo.svg",
    apple: "/logo.svg",
  },

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen bg-background antialiased ${inter.className}`}>
        <ThemeProvider>
          <ReactQueryProvider>
            {children}
            <Toaster richColors position="top-center" />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
