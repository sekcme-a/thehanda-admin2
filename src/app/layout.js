import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import AuthProvider from "@/provider/AuthProvider";
import DataProvider from "@/provider/DataProvider";
import theme from "@/theme";
import NotificationProvider from "@/provider/NotificationProvider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "더한다",
  description: "더한다 - 우리가족 행복비서",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
           
              <AuthProvider>
                <DataProvider>
                  <NotificationProvider>
                    {children}
                  </NotificationProvider>
                </DataProvider>
              </AuthProvider>
     
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
