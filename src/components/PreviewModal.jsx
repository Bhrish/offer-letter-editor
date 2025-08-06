// src/components/PreviewModal.jsx
import React from 'react';

export default function PreviewModal({ template, onClose }) {
  const downloadPdf = () => alert('Download logic goes here');
  const shareLink = () => alert('Share logic goes here');

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        {template.logoUrl && <img src={template.logoUrl} alt="logo" style={{ maxHeight: '80px' }}/>}
        <h2>{template.meta.position} Offer Letter</h2>
        <p><strong>Candidate:</strong> {template.meta.candidateName}</p>
        <div dangerouslySetInnerHTML={{ __html: template.content }} />
        <div className="modal-footer">
          <button onClick={downloadPdf}>Download</button>
          <button onClick={shareLink}>Share</button>
        </div>
      </div>
    </div>
  );
}
