import type { Metadata } from "next";
import { Sofia_Sans } from "next/font/google";
import "@fontsource/stack-sans-notch/700.css";
import "./globals.css";
import { CityProvider } from "@/contexts/CityContext";
import BottomNav from "@/components/BottomNav";

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
        <html lang="en" suppressHydrationWarning>
            <body className={sofiaSans.className} suppressHydrationWarning>
                <CityProvider>
                    <main className="min-h-screen text-gray-900 pb-20 md:pb-0">
                        {children}
                    </main>
                    <BottomNav />
                </CityProvider>
            </body>
        </html>
    );
}
