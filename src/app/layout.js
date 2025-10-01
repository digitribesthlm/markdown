import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata = {
	title: "DigiTribe Tools",
	description: "Markdown and HTML utilities",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable}`} style={{ background: "#f5f7fa" }}>
				<header style={{ background: "#fff", borderBottom: "1px solid #e9edf3", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
					<div style={{
						maxWidth: 1200,
						margin: "0 auto",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						padding: "16px 24px"
					}}>
						<Link href="/" style={{ textDecoration: "none", color: "#ff7a59", fontWeight: 800, fontSize: 20 }}>
							DigiTribe
						</Link>
						<nav style={{ display: "flex", gap: 12 }}>
							<Link href="/" style={{ color: "#33475b", textDecoration: "none", padding: "8px 12px", borderRadius: 8 }}>Markdown → HTML</Link>
							<Link href="/strip-html" style={{ color: "#33475b", textDecoration: "none", padding: "8px 12px", borderRadius: 8 }}>HTML → Text</Link>
							<Link href="/extract-links" style={{ color: "#33475b", textDecoration: "none", padding: "8px 12px", borderRadius: 8 }}>Extract Links</Link>
						</nav>
					</div>
				</header>
				<main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
					{children}
				</main>
			</body>
		</html>
	);
}
