import React, { useRef, useState, useEffect } from 'react';
import { fetchTemplateById, saveTemplate } from '../api';
import PreviewModal from './PreviewModal';
import './OfferLetterEditor.css';

const defaultTemplate = {
  name: '',
  logoUrl: '',
  meta: { candidateName: '', position: '' },
  contentHtml: `<h3>Heading 3</h3><h4>Heading 4</h4><h5>Heading 5</h5><h6>Heading 6</h6>
<p>In the year 2147, X_AE_B_22, a synthetic intelligence, awakens in the heart of Neo–Tokyo, the sprawling megacity of towering neon spires and endless bustling streets.</p>`
};

export default function OfferLetterEditor({ templateId, onSaveComplete, onCancel }) {
  const [template, setTemplate] = useState(defaultTemplate);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);
  const editorRef = useRef();

  useEffect(() => {
    if (templateId) {
      fetchTemplateById(templateId).then(t => {
        setTemplate({
          ...t,
          contentHtml: t.contentHtml || defaultTemplate.contentHtml
        });
      });
    }
  }, [templateId]);

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

  const handleSave = async (overwrite = false) => {
    const payload = {
      ...template,
      contentHtml: editorRef.current.innerHTML,
      createdBy: 'Current User',
      createOn: new Date().toISOString().split('T')[0]
    };
    const res = await saveTemplate(payload, overwrite ? templateId : null);
    onSaveComplete(res.id);
  };

  const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validate image type (optional)
  if (!file.type.startsWith("image/")) {
    alert("Please upload a valid image file.");
    return;
  }

   const url = URL.createObjectURL(file);
  document.execCommand("insertImage", false, url);

  e.target.value = ''; // reset input so same file can be selected again
};


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
        <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload}/>
        <button onClick={() => insertTag('CandidateName')}>Tags</button>
      </div>

      <div className="editor-canvas">
        <div
          ref={editorRef}
          className="editable-area"
          contentEditable
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{ __html: template.contentHtml }}
        ></div>
      </div>

      <div className="editor-footer">
        <button onClick={() => setShowPreview(true)}>Preview</button>
        <button onClick={() => handleSave(false)}>Save As New</button>
        <button onClick={() => handleSave(true)}>Save Changes</button>
        <button onClick={onCancel}>Discard</button>
      </div>

      {showPreview && (
        <PreviewModal template={template} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}
