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
    // Get the HTML output from marked
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

  // Add CSS styles for the preview to ensure proper spacing
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
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      minHeight: "100vh", 
      background: "#fff",
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <style dangerouslySetInnerHTML={{ __html: previewStyles }} />
      {/* Header */}
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "20px 40px", 
        borderBottom: "1px solid #eaeaea" 
      }}>
        <div style={{ 
          color: "#2563EB", 
          fontWeight: "bold", 
          fontSize: "1.5rem" 
        }}>
          DigiTribe
        </div>
        <div style={{ 
          color: "#4B5563", 
          cursor: "pointer" 
        }}>
          Contact Us
        </div>
      </header>

      {/* Main content */}
      <main style={{ 
        flex: 1, 
        padding: "40px",
        maxWidth: "1200px",
        width: "100%",
        margin: "0 auto"
      }}>
        {/* Hero section */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          marginBottom: "60px", 
          textAlign: "center" 
        }}>
          <h1 style={{ 
            fontSize: "3rem", 
            fontWeight: "800", 
            color: "#111827", 
            marginBottom: "16px" 
          }}>
            Convert Markdown to HTML
          </h1>
          <p style={{ 
            fontSize: "1.2rem", 
            color: "#4B5563", 
            maxWidth: "600px", 
            marginBottom: "32px" 
          }}>
            Paste or type your markdown and see it rendered instantly as HTML.
          </p>
        </div>

        {/* Conversion interface */}
        <div style={{ 
          display: "flex", 
          gap: "40px", 
          width: "100%",
          marginBottom: "40px" 
        }}>
          {/* Markdown Input */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <label style={{ 
              fontWeight: "600", 
              marginBottom: "12px", 
              color: "#374151", 
              fontSize: "1.1rem" 
            }}>
              Enter Markdown
            </label>
            <textarea
              value={markdown}
              onChange={e => setMarkdown(e.target.value)}
              style={{ 
                width: "100%", 
                minHeight: "450px", 
                fontFamily: "monospace", 
                fontSize: "16px", 
                padding: "16px", 
                border: "1px solid #d1d5db", 
                borderRadius: "8px", 
                resize: "vertical",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                lineHeight: "1.5",
                whiteSpace: "pre-wrap"
              }}
            />
          </div>
          
          {/* HTML Preview */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <label style={{ 
              fontWeight: "600", 
              marginBottom: "12px", 
              color: "#374151",
              fontSize: "1.1rem" 
            }}>
              Preview
            </label>
            <div
              ref={htmlRef}
              className="markdown-preview"
              style={{ 
                background: "#fff", 
                minHeight: "450px", 
                border: "1px solid #d1d5db", 
                borderRadius: "8px", 
                padding: "16px", 
                overflow: "auto",
                width: "100%",
                boxSizing: "border-box",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
              }}
              dangerouslySetInnerHTML={{ __html: getFormattedHTML() }}
            />
            <div style={{ marginTop: "20px", display: "flex", alignItems: "center" }}>
              <button 
                onClick={copyToClipboard}
                style={{
                  backgroundColor: "#2563EB",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "1rem",
                  marginRight: "16px",
                  transition: "background-color 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                Copy HTML
              </button>
              <span style={{ 
                color: "#10B981", 
                fontWeight: "600",
                fontSize: "0.95rem"
              }}>
                {copySuccess}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
