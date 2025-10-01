"use client";

import { useState } from "react";

export default function ExtractLinksPage() {
	const [htmlInput, setHtmlInput] = useState(`<div>
	<h1>Sample HTML with Links</h1>
	<p>Here are some links:</p>
	<ul>
		<li><a href="/news">Relative news link</a></li>
		<li><a href="http://example.com">HTTP link</a></li>
		<li><a href="https://github.com">GitHub</a></li>
		<li><a href="#section">Anchor link</a></li>
		<li><a href="mailto:test@example.com">Email link</a></li>
	</ul>
</div>`);
	const [extractedLinks, setExtractedLinks] = useState([]);
	const [copied, setCopied] = useState("");
	const [baseDomain, setBaseDomain] = useState("");

	const extractLinks = (html) => {
		if (!html) return [];
		
		const temp = document.createElement("div");
		temp.innerHTML = html;
		
		const links = [];
		const anchorTags = temp.querySelectorAll("a[href]");
		
		anchorTags.forEach((link, index) => {
			const href = link.getAttribute("href");
			const text = link.textContent.trim();
			
			// Categorize the link type
			let type = "other";
			if (href.startsWith("http://")) {
				type = "http";
			} else if (href.startsWith("https://")) {
				type = "https";
			} else if (href.startsWith("/") || (!href.includes("://") && !href.startsWith("#") && !href.startsWith("mailto:") && !href.startsWith("tel:"))) {
				type = "relative";
			} else if (href.startsWith("#")) {
				type = "anchor";
			} else if (href.startsWith("mailto:")) {
				type = "email";
			} else if (href.startsWith("tel:")) {
				type = "phone";
			}
			
			links.push({
				id: index + 1,
				href: href,
				text: text || "(no text)",
				type: type
			});
		});
		
		return links;
	};

	const handleExtract = () => {
		const links = extractLinks(htmlInput);
		setExtractedLinks(links);
	};

	const getFullUrl = (link) => {
		// Only prepend base domain to relative links
		if (link.type === "relative" && baseDomain.trim()) {
			const domain = baseDomain.trim().replace(/\/$/, ""); // Remove trailing slash if present
			// Add leading slash if the href doesn't start with one
			const href = link.href.startsWith("/") ? link.href : `/${link.href}`;
			return `${domain}${href}`;
		}
		return link.href;
	};

	const copyLinks = async () => {
		try {
			const linkText = extractedLinks.map(link => {
				const fullUrl = getFullUrl(link);
				return fullUrl;
			}).join("\n");
			await navigator.clipboard.writeText(linkText);
			setCopied("Copied!");
			setTimeout(() => setCopied(""), 2000);
		} catch {
			setCopied("Failed to copy");
		}
	};

	const copyAsMarkdown = async () => {
		try {
			const markdownLinks = extractedLinks.map(link => {
				const fullUrl = getFullUrl(link);
				return `[${link.text}](${fullUrl})`;
			}).join("\n");
			await navigator.clipboard.writeText(markdownLinks);
			setCopied("Markdown copied!");
			setTimeout(() => setCopied(""), 2000);
		} catch {
			setCopied("Failed to copy");
		}
	};

	const getTypeColor = (type) => {
		const colors = {
			https: "#10B981",
			http: "#F59E0B", 
			relative: "#3B82F6",
			anchor: "#8B5CF6",
			email: "#EF4444",
			phone: "#06B6D4",
			other: "#6B7280"
		};
		return colors[type] || colors.other;
	};

	return (
		<div style={{ fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
			<div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24, textAlign: "center" }}>
				<h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#33475b", marginBottom: 8 }}>
					Extract Links from HTML
				</h1>
				<p style={{ color: "#516f90", maxWidth: 640 }}>
					Paste HTML below and extract all links with their text content and types.
				</p>
			</div>

			<div style={{ display: "flex", gap: 24 }}>
				<div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
					<label style={{ fontWeight: 700, marginBottom: 8, color: "#33475b" }}>HTML Input</label>
					<textarea
						value={htmlInput}
						onChange={(e) => setHtmlInput(e.target.value)}
						style={{ 
							width: "100%", 
							minHeight: 280, 
							fontFamily: "monospace", 
							fontSize: 14, 
							padding: 12, 
							border: "1px solid #e9edf3", 
							borderRadius: 10, 
							background: "#fff", 
							resize: "vertical" 
						}}
					/>
					<div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
						<label style={{ fontWeight: 700, color: "#33475b", fontSize: 14 }}>
							Base Domain (optional)
						</label>
						<input
							type="text"
							value={baseDomain}
							onChange={(e) => setBaseDomain(e.target.value)}
							placeholder="https://www.example.com"
							style={{
								padding: "10px 12px",
								border: "1px solid #e9edf3",
								borderRadius: 10,
								background: "#fff",
								fontSize: 14,
								fontFamily: "monospace"
							}}
						/>
						<p style={{ fontSize: 12, color: "#516f90", margin: 0 }}>
							Will be prepended to relative links (paths without http/https) when copying
						</p>
					</div>
					<button 
						onClick={handleExtract} 
						style={{ 
							marginTop: 12, 
							alignSelf: "flex-start", 
							backgroundColor: "#ff7a59", 
							color: "#fff", 
							border: "none", 
							padding: "10px 16px", 
							borderRadius: 8, 
							cursor: "pointer", 
							fontWeight: 600 
						}}
					>
						Extract Links
					</button>
				</div>

				<div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
					<label style={{ fontWeight: 700, marginBottom: 8, color: "#33475b" }}>
						Extracted Links ({extractedLinks.length})
					</label>
					<div style={{ 
						width: "100%", 
						minHeight: 320, 
						border: "1px solid #e9edf3", 
						borderRadius: 10, 
						background: "#fff",
						overflow: "auto",
						padding: 12
					}}>
						{extractedLinks.length === 0 ? (
							<p style={{ color: "#516f90", fontStyle: "italic" }}>No links found. Click "Extract Links" to analyze the HTML.</p>
						) : (
							<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
								{extractedLinks.map((link) => (
									<div 
										key={link.id} 
										style={{ 
											background: "#fff", 
											padding: 12, 
											borderRadius: 10, 
											border: "1px solid #e9edf3",
											boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
										}}
									>
										<div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
											<span 
												style={{ 
													background: getTypeColor(link.type), 
													color: "white", 
													padding: "2px 8px", 
													borderRadius: 999, 
													fontSize: 12, 
													fontWeight: 600,
													textTransform: "uppercase"
												}}
											>
												{link.type}
											</span>
											<span style={{ fontSize: 12, color: "#7c98b6" }}>#{link.id}</span>
										</div>
										<div style={{ fontFamily: "monospace", fontSize: 13, color: "#33475b", wordBreak: "break-all" }}>
											{getFullUrl(link)}
											{link.type === "relative" && baseDomain.trim() && link.href !== getFullUrl(link) && (
												<span style={{ fontSize: 11, color: "#7c98b6", marginLeft: 8 }}>
													(original: {link.href})
												</span>
											)}
										</div>
										{link.text !== "(no text)" && (
											<div style={{ fontSize: 12, color: "#516f90", marginTop: 4 }}>
												Text: "{link.text}"
											</div>
										)}
									</div>
								))}
							</div>
						)}
					</div>
					<div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
						<button 
							onClick={copyLinks} 
							disabled={extractedLinks.length === 0}
							style={{ 
								backgroundColor: extractedLinks.length === 0 ? "#9CA3AF" : "#ff7a59", 
								color: "white", 
								border: "none", 
								padding: "10px 16px", 
								borderRadius: 8, 
								cursor: extractedLinks.length === 0 ? "not-allowed" : "pointer", 
								fontWeight: 600 
							}}
						>
							Copy Links
						</button>
						<button 
							onClick={copyAsMarkdown} 
							disabled={extractedLinks.length === 0}
							style={{ 
								backgroundColor: extractedLinks.length === 0 ? "#9CA3AF" : "#00bda5", 
								color: "white", 
								border: "none", 
								padding: "10px 16px", 
								borderRadius: 8, 
								cursor: extractedLinks.length === 0 ? "not-allowed" : "pointer", 
								fontWeight: 600 
							}}
						>
							Copy as Markdown
						</button>
						<span style={{ color: "#00bda5", fontWeight: 600 }}>{copied}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
