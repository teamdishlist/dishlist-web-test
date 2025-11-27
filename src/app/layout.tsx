import type { Metadata } from "next";
import { Sofia_Sans } from "next/font/google";
import "./globals.css";
import { CityProvider } from "@/contexts/CityContext";

const sofiaSans = Sofia_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
    variable: "--font-sofia-sans"
});

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
            <body className={sofiaSans.className}>
                <CityProvider>
                    <main className="min-h-screen bg-gray-50 text-gray-900 pb-20">
                        {children}
                    </main>
                </CityProvider>
            </body>
        </html>
    );
}
