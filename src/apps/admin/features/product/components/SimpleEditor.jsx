import React, { useRef, useEffect } from "react";
import "./SimpleEditor.css";

/**
 * Simple WYSIWYG Editor using contentEditable
 * Supports: Bold, Italic, Underline, Lists, Links
 */
function SimpleEditor({ value, onChange, placeholder = "Nhập nội dung..." }) {
  const editorRef = useRef(null);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange({ target: { name: 'description', value: content } });
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt("Nhập URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const formatButtons = [
    {
      icon: "fa-bold",
      label: "Bold (Ctrl+B)",
      command: "bold",
    },
    {
      icon: "fa-italic",
      label: "Italic (Ctrl+I)",
      command: "italic",
    },
    {
      icon: "fa-underline",
      label: "Underline (Ctrl+U)",
      command: "underline",
    },
    {
      icon: "fa-strikethrough",
      label: "Strikethrough",
      command: "strikeThrough",
    },
    {
      icon: "fa-list-ul",
      label: "Bullet List",
      command: "insertUnorderedList",
    },
    {
      icon: "fa-list-ol",
      label: "Numbered List",
      command: "insertOrderedList",
    },
    {
      icon: "fa-align-left",
      label: "Align Left",
      command: "justifyLeft",
    },
    {
      icon: "fa-align-center",
      label: "Align Center",
      command: "justifyCenter",
    },
    {
      icon: "fa-align-right",
      label: "Align Right",
      command: "justifyRight",
    },
    {
      icon: "fa-link",
      label: "Insert Link",
      action: insertLink,
    },
    {
      icon: "fa-remove-format",
      label: "Remove Formatting",
      command: "removeFormat",
    },
  ];

  const headingButtons = [
    { label: "Normal", command: "formatBlock", value: "p" },
    { label: "H1", command: "formatBlock", value: "h1" },
    { label: "H2", command: "formatBlock", value: "h2" },
    { label: "H3", command: "formatBlock", value: "h3" },
    { label: "H4", command: "formatBlock", value: "h4" },
  ];

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b px-3 py-2 flex flex-wrap gap-2 items-center">
        {/* Heading Dropdown */}
        <select
          onChange={(e) => execCommand("formatBlock", e.target.value)}
          className="text-sm border rounded px-2 py-1 bg-white"
          defaultValue="p"
        >
          {headingButtons.map((btn, idx) => (
            <option key={idx} value={btn.value}>
              {btn.label}
            </option>
          ))}
        </select>

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Format Buttons */}
        {formatButtons.map((btn, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => btn.action ? btn.action() : execCommand(btn.command)}
            className="px-2.5 py-1.5 text-sm rounded transition text-gray-700 hover:bg-gray-200"
            title={btn.label}
          >
            <i className={`fa-solid ${btn.icon}`}></i>
          </button>
        ))}
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="w-full px-4 py-3 min-h-[200px] max-h-[400px] overflow-y-auto focus:outline-none simple-editor-content"
        style={{
          wordWrap: "break-word",
          whiteSpace: "pre-wrap",
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />

      {/* Hint */}
      <div className="bg-gray-50 border-t px-3 py-2 text-xs text-gray-500">
        <i className="fa-solid fa-info-circle mr-1"></i>
        Sử dụng thanh công cụ để định dạng văn bản
      </div>
    </div>
  );
}

export default SimpleEditor;
