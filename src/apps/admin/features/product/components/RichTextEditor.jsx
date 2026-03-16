import React, { useState, useRef } from "react";
import "./RichTextEditor.css";
import MarkdownPreview from "./MarkdownPreview";

function RichTextEditor({ value, onChange, placeholder = "Nhập nội dung..." }) {
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const textareaRef = useRef(null);

  const insertText = (before, after = "") => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);
    onChange({ target: { value: newText } });
    
    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const insertImage = () => {
    if (imageUrl.trim()) {
      insertText(`![Hình ảnh](${imageUrl})`);
      setImageUrl("");
      setShowImageModal(false);
    }
  };

  const insertVideo = () => {
    if (videoUrl.trim()) {
      insertText(`[Video](${videoUrl})`);
      setVideoUrl("");
      setShowVideoModal(false);
    }
  };

  const formatButtons = [
    {
      icon: "fa-bold",
      label: "Bold",
      action: () => insertText("**", "**"),
    },
    {
      icon: "fa-italic",
      label: "Italic",
      action: () => insertText("*", "*"),
    },
    {
      icon: "fa-underline",
      label: "Underline",
      action: () => insertText("<u>", "</u>"),
    },
    {
      icon: "fa-heading",
      label: "Heading",
      action: () => insertText("## "),
    },
    {
      icon: "fa-list-ul",
      label: "Bullet List",
      action: () => insertText("- "),
    },
    {
      icon: "fa-list-ol",
      label: "Numbered List",
      action: () => insertText("1. "),
    },
    {
      icon: "fa-link",
      label: "Link",
      action: () => insertText("[", "](url)"),
    },
    {
      icon: "fa-image",
      label: "Insert Image",
      action: () => setShowImageModal(true),
    },
    {
      icon: "fa-video",
      label: "Insert Video",
      action: () => setShowVideoModal(true),
    },
    {
      icon: "fa-code",
      label: "Code",
      action: () => insertText("`", "`"),
    },
    {
      icon: showPreview ? "fa-edit" : "fa-eye",
      label: showPreview ? "Edit" : "Preview",
      action: () => setShowPreview(!showPreview),
      special: true,
    },
  ];

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b px-3 py-2 flex flex-wrap gap-1">
        {formatButtons.map((btn, idx) => (
          <button
            key={idx}
            type="button"
            onClick={btn.action}
            className={`px-2.5 py-1.5 text-sm rounded transition ${
              btn.special && showPreview
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                : "text-gray-700 hover:bg-gray-200"
            }`}
            title={btn.label}
          >
            <i className={`fa-solid ${btn.icon}`}></i>
          </button>
        ))}
      </div>

      {/* Text Area or Preview */}
      {showPreview ? (
        <MarkdownPreview content={value} />
      ) : (
        <>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-4 py-3 min-h-[200px] focus:outline-none resize-y font-mono text-sm"
            style={{ fontFamily: "monospace" }}
          />

          {/* Preview Hint */}
          <div className="bg-gray-50 border-t px-3 py-2 text-xs text-gray-500">
            <i className="fa-solid fa-info-circle mr-1"></i>
            Hỗ trợ Markdown: **bold**, *italic*, ## heading, [link](url), ![image](url)
          </div>
        </>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Chèn Hình ảnh</h3>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Nhập URL hình ảnh..."
              className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-none focus:border-black"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={insertImage}
                className="flex-1 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
              >
                Chèn
              </button>
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setImageUrl("");
                }}
                className="flex-1 bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 transition"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Chèn Video</h3>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Nhập URL video..."
              className="w-full border rounded-md px-3 py-2 mb-4 focus:outline-none focus:border-black"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={insertVideo}
                className="flex-1 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
              >
                Chèn
              </button>
              <button
                onClick={() => {
                  setShowVideoModal(false);
                  setVideoUrl("");
                }}
                className="flex-1 bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 transition"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RichTextEditor;
