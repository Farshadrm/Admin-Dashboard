import "./globals.css";
export const metadata = {
    title: "Admin Dashboard",
    description: "Store products administration dashboard",
};
export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="pb-32 lg:pb-0">{children}</body>
        </html>
    );
}
