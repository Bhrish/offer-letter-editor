// src/components/OfferLetterEditor.jsx
import React, { useRef, useState, useEffect } from 'react';
import { saveTemplate } from '../api';
import PreviewModal from './PreviewModal';
import logoConfig from '../config/logoConfig.json';
import uiText from '../config/uiTextConfig.json';
import './OfferLetterEditor.css';

const companyKey = 'companyA';
const companyLogo = logoConfig[companyKey];

const getLogoHtml = (alignment = companyLogo.alignment) => {
  return `
    <div id="logo-block" class="logo-img align-${alignment}">
      <img src="${companyLogo.src}" style="max-width: ${companyLogo.width}" alt="Company Logo" />
    </div>`;
};

const defaultTemplate = {
  name: '',
  meta: { candidateName: '', position: '' },
  contentHtml: `
    ${getLogoHtml()}
    <h3>${uiText.labels.heading}</h3>
    <p>${uiText.labels.paragraphPlaceholder}</p>
  `
};

export default function OfferLetterEditor({ templateId, onSaveComplete, onCancel }) {
  const [template, setTemplate] = useState(defaultTemplate);
  const [showPreview, setShowPreview] = useState(false);
  const [logoAlignment, setLogoAlignment] = useState(companyLogo.alignment);

  const editorRef = useRef();
  const fileInputRef = useRef(null);

  const exec = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
  };

  const insertTag = (tag) => {
    const span = document.createElement('span');
    span.textContent = `{{${tag}}}`;
    span.className = 'editor-tag';
    const range = window.getSelection().getRangeAt(0);
    range.insertNode(span);
  };

  const getPreviewContentHtml = () => {
    const rawHtml = editorRef.current?.innerHTML || '';
    const logoRegex = /<div id="logo-block"[^>]*>[\s\S]*?<\/div>/;
    return rawHtml.replace(logoRegex, getLogoHtml(logoAlignment));
  };

  const replaceLogoPlaceholder = (html) => {
    return html.replace(
      /<div id="logo-block"[^>]*>[\s\S]*?<\/div>/,
      getLogoHtml(logoAlignment)
    );
  };

  const handleSave = async (overwrite = false) => {
    const rawHtml = editorRef.current.innerHTML;
    const finalHtml = replaceLogoPlaceholder(rawHtml);

    const payload = {
      ...template,
      contentHtml: finalHtml,
      createdBy: 'Current User',
      createOn: new Date().toISOString().split('T')[0]
    };
    const res = await saveTemplate(payload, overwrite ? templateId : null);
    onSaveComplete(res.id);
  };

  const handleSaveFromPreview = async () => {
    const rawHtml = editorRef.current?.innerHTML || '';
    const headingMatch = rawHtml.match(/<h3[^>]*>(.*?)<\/h3>/i);
    const heading = headingMatch ? headingMatch[1].trim() : 'Untitled';
    const finalHtml = replaceLogoPlaceholder(rawHtml);

    const payload = {
      ...template,
      name: heading,
      contentHtml: finalHtml,
      createdBy: 'Current User',
      createOn: new Date().toISOString().split('T')[0]
    };

    const res = await saveTemplate(payload);
    setTemplate(prev => ({ ...prev, name: heading }));
    onSaveComplete(res.id);
    setShowPreview(false);
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const logoHtml = getLogoHtml(logoAlignment);
    editor.innerHTML = editor.innerHTML.replace(
      /<div id="logo-block"[^>]*>[\s\S]*?<\/div>/,
      logoHtml
    );
  }, [logoAlignment]);

  return (
    <div className="editor-wrapper">
      <div className="editor-toolbar">
        <select onChange={(e) => exec('fontSize', e.target.value)}>
          {[1,2,3,4,5,6,7].map(size => (
            <option key={size} value={size}>{size * 2 + 8}px</option>
          ))}
        </select>
        <button onClick={() => exec('bold')}><i className="fas fa-bold"></i></button>
        <button onClick={() => exec('italic')}><i className="fas fa-italic"></i></button>
        <button onClick={() => exec('underline')}><i className="fas fa-underline"></i></button>
        <button onClick={() => exec('strikeThrough')}><i className="fas fa-strikethrough"></i></button>
        <button onClick={() => exec('justifyLeft')}><i className="fas fa-align-left"></i></button>
        <button onClick={() => exec('justifyCenter')}><i className="fas fa-align-center"></i></button>
        <button onClick={() => exec('justifyRight')}><i className="fas fa-align-right"></i></button>
        <button onClick={() => exec('insertUnorderedList')}><i className="fas fa-list-ul"></i></button>
        <button onClick={() => exec('insertOrderedList')}><i className="fas fa-list-ol"></i></button>
        <button onClick={() => fileInputRef.current.click()}><i className="fas fa-image"></i></button>
        <button onClick={() => insertTag('CandidateName')}>Tags</button>
        <select
          value={`align-${logoAlignment}`}
          onChange={(e) => setLogoAlignment(e.target.value.replace('align-', ''))}
        >
          <option value="align-left">Logo Left</option>
          <option value="align-center">Logo Center</option>
          <option value="align-right">Logo Right</option>
        </select>
      </div>

      <div className="editor-canvas">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={() => {}}
        />
        <div
          ref={editorRef}
          className="editable-area"
          contentEditable
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{ __html: template.contentHtml }}
        ></div>
      </div>

      <div className="editor-footer">
        <button onClick={() => setShowPreview(true)}>{uiText.buttons.preview}</button>
        <button onClick={() => handleSave(false)}>{uiText.buttons.saveNew}</button>
        <button onClick={() => handleSave(true)}>{uiText.buttons.saveChanges}</button>
        <button onClick={onCancel}>{uiText.buttons.discard}</button>
      </div>

      {showPreview && (
        <PreviewModal
          template={{ ...template, contentHtml: getPreviewContentHtml() }}
          onClose={() => setShowPreview(false)}
          onSave={handleSaveFromPreview}
        />
      )}
    </div>
  );
}
