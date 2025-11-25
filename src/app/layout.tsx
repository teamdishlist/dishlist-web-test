import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CityProvider } from "@/contexts/CityContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "DishList - Find the best food in your city",
    description: "Location-first, category-led food discovery.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <CityProvider>
                    <main className="min-h-screen bg-gray-50 text-gray-900 pb-20">
                        {children}
                    </main>
                </CityProvider>
            </body>
        </html>
    );
}
