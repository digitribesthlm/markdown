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
	const [includeRelative, setIncludeRelative] = useState(false);

	const extractLinks = (html) => {
		if (!html) return [];
		// Parse safely and strip resource-loading elements to avoid network requests
		const parser = new DOMParser();
		const doc = parser.parseFromString(String(html), "text/html");
		// Remove elements that could trigger network loads
		doc.querySelectorAll("img, source, link[rel*=icon], link[rel*=preload], script, video, audio, iframe").forEach(el => el.remove());

		const links = [];
		const seen = new Set();
		const anchorTags = doc.querySelectorAll("a[href]");
		const ignoredExtRegex = /\.(png|jpe?g|gif|svg|webp|bmp|ico|tiff?|mp4|webm|ogv|mp3|wav|ogg|woff2?|woff|ttf|eot|css|js)(\?|#|$)/i;
		
		anchorTags.forEach((link, index) => {
			const href = link.getAttribute("href");
			if (!href) return;
			if (href.toLowerCase().startsWith("javascript:")) return; // skip javascript:void(0)
			if (href.startsWith("#")) return; // skip anchors entirely
			if (ignoredExtRegex.test(href)) return; // skip static assets
			const text = link.textContent.trim();
			
			// Categorize the link type
			let type = "other";
			if (href.startsWith("http://")) {
				type = "http";
			} else if (href.startsWith("https://")) {
				type = "https";
			} else if (href.startsWith("/") || (!href.includes("://") && !href.startsWith("#") && !href.startsWith("mailto:") && !href.startsWith("tel:"))) {
				type = "relative";
			} else if (href.startsWith("mailto:")) {
				type = "email";
			} else if (href.startsWith("tel:")) {
				type = "phone";
			}
			const key = href;
			if (!seen.has(key)) {
				seen.add(key);
				links.push({
					id: links.length + 1,
					href: href,
					text: text || "(no text)",
					type: type
				});
			}
		});
		
		// Fallback: also extract URLs present in raw text without <a> tags
		const raw = typeof html === "string" ? html : (doc.body?.textContent || "");
		const httpRegex = /(https?:\/\/[^\s"'<>]+)/gi;
		const relSlashRegex = /(^|[\s"'=(>])\/(?!\/)\S+/gi; // starts with single /
		const relPathRegex = /(^|[\s"'=(>])([a-z0-9][a-z0-9._~\-]*\/[a-z0-9._~\-/%#?=&]+)/gi; // path-like without scheme or leading /

		const isLikelyValidRelative = (href) => {
			// Reject CSS comments, HTML closers and property-like tokens
			if (!href) return false;
			if (href === "/") return false;
			if (href.startsWith("/*") || href.startsWith("*/") || href.startsWith("/>")) return false;
			if (/\/[\*>]/.test(href)) return false; // '/*', '/>' etc inside path
			if (/\s/.test(href)) return false;
			// If there's a colon and it's not a scheme we support, drop it (e.g. 'border-color:')
			if (href.includes(":") && !href.startsWith("http") && !href.startsWith("mailto:") && !href.startsWith("tel:")) return false;
			// Basic allowed character check
			return /^[/#a-z0-9._~\-/%?#=&]+$/i.test(href);
		};

		const pushMatch = (href) => {
			if (!href) return;
			const cleanHref = href.trim();
			if (!cleanHref) return;
			// Normalize from relSlashRegex capturing leading boundary
			const normalized = cleanHref.startsWith("/") ? cleanHref : cleanHref.replace(/^[\s"'=(>)]/, "");
			if (!normalized) return;
			// Skip obvious non-links
			if (normalized.startsWith("mailto:") || normalized.startsWith("tel:") || normalized.startsWith("#") || normalized.toLowerCase().startsWith("javascript:")) return;
			if (ignoredExtRegex.test(normalized)) return; // skip static assets
			if (!normalized.includes("://") && !isLikelyValidRelative(normalized)) return;
			const key = normalized;
			if (seen.has(key)) return;
			// Determine type
			let type = "other";
			if (normalized.startsWith("http://")) type = "http";
			else if (normalized.startsWith("https://")) type = "https";
			else if (!normalized.includes("://")) type = normalized.startsWith("/") ? "relative" : "relative";
			seen.add(key);
			links.push({ id: links.length + 1, href: normalized, text: "(no text)", type });
		};

		(raw.match(httpRegex) || []).forEach(m => pushMatch(m));
		(raw.match(relSlashRegex) || []).forEach(m => pushMatch(m.replace(/^[^/]*/, "")));
		(raw.match(relPathRegex) || []).forEach(m => {
			const candidate = m.trim().replace(/^[^a-z0-9]*/i, "");
			if (!candidate.includes("://")) pushMatch(candidate);
		});

		return links;
	};

	const handleExtract = () => {
		const links = extractLinks(htmlInput).map(l => ({ ...l, href: stripQueryAndHash(l.href) }));
		const filtered = includeRelative ? links : links.filter(l => l.type !== "relative");
		setExtractedLinks(filtered);
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

	const stripQueryAndHash = (url) => url.replace(/[?#].*$/, "");

	const getOutputUrl = (link) => {
		const full = getFullUrl(link);
		return stripQueryAndHash(full);
	};

	const copyLinks = async () => {
		try {
			const unique = new Set();
			const linkText = extractedLinks.map(link => getOutputUrl(link))
				.filter(u => {
					if (unique.has(u)) return false;
					unique.add(u);
					return !!u;
				})
				.join("\n");
			await navigator.clipboard.writeText(linkText);
			setCopied("Copied!");
			setTimeout(() => setCopied(""), 2000);
		} catch {
			setCopied("Failed to copy");
		}
	};

	const copyAsMarkdown = async () => {
		try {
			const unique = new Set();
			const markdownLinks = extractedLinks.map(link => {
				const out = getOutputUrl(link);
				return `[${link.text}](${out})`;
			})
				.filter(line => {
					const url = line.match(/\((.*)\)$/)?.[1] || "";
					if (!url || unique.has(url)) return false;
					unique.add(url);
					return true;
				})
				.join("\n");
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
						<label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, color: "#33475b", fontSize: 14 }}>
							<input type="checkbox" checked={includeRelative} onChange={(e) => setIncludeRelative(e.target.checked)} />
							Include relative links in results
						</label>
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
