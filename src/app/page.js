"use client";

import { useState, useRef } from "react";
import { marked } from "marked";

export default function Home() {
	const [markdown, setMarkdown] = useState(`# Sample Markdown\n\nThis is some basic, sample markdown.\n\n## Second Heading\n\n* Unordered lists, and:\n  1. One\n  2. Two\n  3. Three\n* More\n\n> Blockquote\n\nAnd **bold**, *italics*, and even *italics and later bold*. Even ~~strikethrough~~. [A link](https://markdowntohtml.com) to somewhere.`);
	const [copySuccess, setCopySuccess] = useState('');
	const htmlRef = useRef(null);

	// Configure marked options to preserve whitespace better
	marked.setOptions({
		gfm: true,
		breaks: true,
		smartLists: true
	});

	const getFormattedHTML = () => {
		const html = marked.parse(markdown);
		return html;
	};

	const copyToClipboard = () => {
		const html = getFormattedHTML();
		navigator.clipboard.writeText(html)
			.then(() => {
				setCopySuccess('Copied!');
				setTimeout(() => setCopySuccess(''), 2000);
			})
			.catch(() => setCopySuccess('Failed to copy'));
	};

	const previewStyles = `
		.markdown-preview h1, .markdown-preview h2, .markdown-preview h3,
		.markdown-preview h4, .markdown-preview h5, .markdown-preview h6 {
			margin-top: 1.5em;
			margin-bottom: 0.75em;
		}
		.markdown-preview p {
			margin-bottom: 1em;
			line-height: 1.6;
		}
		.markdown-preview ul, .markdown-preview ol {
			padding-left: 2em;
			margin-bottom: 1em;
		}
		.markdown-preview li {
			margin-bottom: 0.5em;
		}
		.markdown-preview blockquote {
			border-left: 4px solid #e5e7eb;
			padding-left: 1em;
			margin-left: 0;
			color: #4b5563;
		}
		.markdown-preview pre {
			background-color: #f3f4f6;
			padding: 1em;
			border-radius: 0.375em;
			overflow: auto;
		}
		.markdown-preview code {
			font-family: monospace;
			background-color: #f3f4f6;
			padding: 0.2em 0.4em;
			border-radius: 0.25em;
			font-size: 0.9em;
		}
	`;

	return (
		<div style={{ background: "#fff", fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
			<style dangerouslySetInnerHTML={{ __html: previewStyles }} />

			{/* Hero section */}
			<div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 40, textAlign: "center" }}>
				<h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#111827", marginBottom: 12 }}>
					Convert Markdown to HTML
				</h1>
				<p style={{ fontSize: "1.1rem", color: "#4B5563", maxWidth: 640 }}>
					Paste or type your markdown and see it rendered instantly as HTML.
				</p>
			</div>

			{/* Conversion interface */}
			<div style={{ display: "flex", gap: 32, width: "100%" }}>
				{/* Markdown Input */}
				<div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
					<label style={{ fontWeight: 600, marginBottom: 12, color: "#374151", fontSize: "1.05rem" }}>
						Enter Markdown
					</label>
					<textarea
						value={markdown}
						onChange={e => setMarkdown(e.target.value)}
						style={{ 
							width: "100%", 
							minHeight: 450, 
							fontFamily: "monospace", 
							fontSize: 16, 
							padding: 16, 
							border: "1px solid #d1d5db", 
							borderRadius: 8, 
							resize: "vertical",
							boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
							lineHeight: 1.5,
							whiteSpace: "pre-wrap"
						}}
					/>
				</div>
				
				{/* HTML Preview */}
				<div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
					<label style={{ fontWeight: 600, marginBottom: 12, color: "#374151", fontSize: "1.05rem" }}>
						Preview
					</label>
					<div
						ref={htmlRef}
						className="markdown-preview"
						style={{ 
							background: "#fff", 
							minHeight: 450, 
							border: "1px solid #d1d5db", 
							borderRadius: 8, 
							padding: 16, 
							overflow: "auto",
							width: "100%",
							boxSizing: "border-box",
							boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
						}}
						dangerouslySetInnerHTML={{ __html: getFormattedHTML() }}
					/>
					<div style={{ marginTop: 16, display: "flex", alignItems: "center" }}>
						<button 
							onClick={copyToClipboard}
							style={{
								backgroundColor: "#2563EB",
								color: "white",
								border: "none",
								padding: "12px 20px",
								borderRadius: 6,
								cursor: "pointer",
								fontWeight: 600,
								fontSize: "1rem",
								marginRight: 12
							}}
						>
							Copy HTML
						</button>
						<span style={{ color: "#10B981", fontWeight: 600, fontSize: "0.95rem" }}>
							{copySuccess}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
