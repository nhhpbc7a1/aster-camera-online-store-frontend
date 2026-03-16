import React from "react";
import "./MarkdownPreview.css";

function MarkdownPreview({ content }) {
  if (!content) return null;

  // Simple markdown parser
  const parseMarkdown = (text) => {
    let html = text;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

    // Underline
    html = html.replace(/<u>(.*?)<\/u>/gim, '<u>$1</u>');

    // Code
    html = html.replace(/`(.*?)`/gim, '<code>$1</code>');

    // Images
    html = html.replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1" />');

    // Links (including videos)
    html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Line breaks
    html = html.replace(/\n/gim, '<br />');

    return html;
  };

  return (
    <div className="markdown-preview">
      <div className="markdown-preview-header">
        <i className="fa-solid fa-eye mr-2"></i>
        Preview
      </div>
      <div
        className="markdown-preview-content"
        dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
      />
    </div>
  );
}

export default MarkdownPreview;
