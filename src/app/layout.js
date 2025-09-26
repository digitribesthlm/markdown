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
			<body className={`${geistSans.variable} ${geistMono.variable}`} style={{ background: "#fff" }}>
				<header style={{ borderBottom: "1px solid #eaeaea" }}>
					<div style={{
						maxWidth: 1200,
						margin: "0 auto",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						padding: "16px 24px"
					}}>
						<Link href="/" style={{ textDecoration: "none", color: "#2563EB", fontWeight: 800, fontSize: 20 }}>
							DigiTribe
						</Link>
						<nav style={{ display: "flex", gap: 20 }}>
							<Link href="/" style={{ color: "#374151" }}>Markdown → HTML</Link>
							<Link href="/strip-html" style={{ color: "#374151" }}>HTML → Text</Link>
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
