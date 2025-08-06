// src/components/PreviewModal.jsx
import React from 'react';
import './PreviewModal.css';

export default function PreviewModal({ template, onClose }) {
  const { contentHtml } = template;
  
  return (
    <div className="preview-overlay">
      <div className="preview-modal">
        <div className="preview-header">
          <h2>Preview</h2>
          <p className="preview-subtitle">Offer letter preview</p>
          <button className="preview-close" onClick={onClose}>&times;</button>
        </div>

        <div className="preview-body">
          <div
            className="preview-letter"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>

        <div className="preview-footer">
          <button className="share-btn">Share</button>
          <button className="save-btn">Save Templated</button>
        </div>
      </div>
    </div>
  );
}
