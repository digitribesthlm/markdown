"use client";

import { useState } from "react";

export default function StripHtmlPage() {
	const [htmlInput, setHtmlInput] = useState("<h1>Hello</h1> <p>This is <strong>bold</strong> text.</p>");
	const [textOutput, setTextOutput] = useState("");
	const [copied, setCopied] = useState("");

	const stripHtml = (html) => {
		if (!html) return "";
		const temp = document.createElement("div");
		temp.innerHTML = html;
		return temp.textContent || temp.innerText || "";
	};

	const handleConvert = () => {
		const text = stripHtml(htmlInput);
		setTextOutput(text);
	};

	const copyText = async () => {
		try {
			await navigator.clipboard.writeText(textOutput);
			setCopied("Copied!");
			setTimeout(() => setCopied(""), 2000);
		} catch {
			setCopied("Failed to copy");
		}
	};

	return (
		<div style={{ fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
			<div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24, textAlign: "center" }}>
				<h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#33475b", marginBottom: 8 }}>
					HTML → Plain Text
				</h1>
				<p style={{ color: "#516f90", maxWidth: 640 }}>
					Paste HTML below and convert it to plain text.
				</p>
			</div>

			<div style={{ display: "flex", gap: 24 }}>
				<div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
					<label style={{ fontWeight: 700, marginBottom: 8, color: "#33475b" }}>HTML Input</label>
					<textarea
						value={htmlInput}
						onChange={(e) => setHtmlInput(e.target.value)}
						style={{ width: "100%", minHeight: 320, fontFamily: "monospace", fontSize: 14, padding: 12, border: "1px solid #e9edf3", borderRadius: 10, resize: "vertical", background: "#fff" }}
					/>
					<button onClick={handleConvert} style={{ marginTop: 12, alignSelf: "flex-start", backgroundColor: "#ff7a59", color: "white", border: "none", padding: "10px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
						Convert to Text
					</button>
				</div>

				<div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
					<label style={{ fontWeight: 700, marginBottom: 8, color: "#33475b" }}>Plain Text Output</label>
					<textarea readOnly value={textOutput} style={{ width: "100%", minHeight: 320, fontFamily: "monospace", fontSize: 14, padding: 12, border: "1px solid #e9edf3", borderRadius: 10, resize: "vertical", background: "#fff" }} />
					<div style={{ marginTop: 12, display: "flex", alignItems: "center" }}>
						<button onClick={copyText} style={{ backgroundColor: "#ff7a59", color: "white", border: "none", padding: "10px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 600, marginRight: 12 }}>
							Copy Text
						</button>
						<span style={{ color: "#00bda5", fontWeight: 600 }}>{copied}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
