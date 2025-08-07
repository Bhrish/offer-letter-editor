// src/components/PreviewModal.jsx
import React from 'react';
import './PreviewModal.css';
import html2pdf from 'html2pdf.js';
import uiText from '../config/uiTextConfig.json';

export default function PreviewModal({ template, onClose, onSave }) {
  const { contentHtml } = template;

  

const handleDownload = () => {
  const element = document.querySelector('.preview-letter');
  html2pdf().set({
    margin: 10,
    filename: `${template.name || 'offer-letter'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).from(element).save();
};


  const handleShare = () => {
    const subject = encodeURIComponent(uiText.messages.shareEmailSubject);
    const body = encodeURIComponent(uiText.messages.shareEmailBody);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="preview-overlay">
      <div className="preview-modal">
        <div className="preview-header">
          <h2>{uiText.buttons.preview}</h2>
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
          <button className="share-btn" onClick={handleShare}>{uiText.buttons.share}</button>
          <button className="share-btn" onClick={handleDownload}>{uiText.buttons.download}</button>
          <button className="save-btn" onClick={onSave}>{uiText.buttons.saveTemplate}</button>
        </div>
      </div>
    </div>
  );
}
