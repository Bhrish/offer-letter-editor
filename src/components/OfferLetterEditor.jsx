import React, { useRef, useState, useEffect } from 'react';
import { saveTemplate } from '../api';
import PreviewModal from './PreviewModal';
import './OfferLetterEditor.css';

const defaultTemplate = {
  name: '',
  logoUrl: '',
  meta: { candidateName: '', position: '' },
  contentHtml: `
    <div id="logo-block" class="logo-placeholder align-center">[ Click to Upload Logo ]</div>
    <h3>Heading 3</h3>
    <p>Start writing your offer letter here...</p>
  `
};

export default function OfferLetterEditor({ templateId, onSaveComplete, onCancel }) {
  const [template] = useState(defaultTemplate);
  const [showPreview, setShowPreview] = useState(false);

  const editorRef = useRef();
  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const imageURL = URL.createObjectURL(file);

    const wrapper = document.createElement('div');
    wrapper.className = 'resizable-image';
    const img = document.createElement('img');
    img.src = imageURL;
    wrapper.appendChild(img);

    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(wrapper);
    }

    e.target.value = '';
  };

  const handleLogoUpload = (e) => {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith("image/")) {
    alert("Invalid image file.");
    return;
  }

  const url = URL.createObjectURL(file);

  const logoBlock = document.getElementById('logo-block');
  if (logoBlock) {
    // Replace inner HTML only, not outer div
    logoBlock.className = 'logo-img align-center';
    logoBlock.innerHTML = `<img src="${url}" style="max-width: 100%" />`;
    
  }

  e.target.value = '';
};
const getPreviewContentHtml = () => {
  const rawHtml = editorRef.current?.innerHTML || '';

  // Regex matches the entire logo block including nested tags and line breaks
  const logoRegex = /<div id="logo-block"[^>]*>[\s\S]*?<\/div>/;

  const replacedHtml = rawHtml.replace(
    logoRegex,
    template.logoUrl
      ? `<div id="logo-block" class="logo-img align-center">
           <img src="${template.logoUrl}" alt="Company Logo" />
         </div>`
      : `<div id="logo-block" class="logo-placeholder align-center">[ Click to Upload Logo ]</div>`
  );

  return replacedHtml;
};


  const replaceLogoPlaceholder = (html, logoUrl) => {
    return html.replace(
      /<div id="logo-block"[^>]*>.*?<\/div>/,
      logoUrl
        ? `<div id="logo-block" class="logo-img align-center"><img src="${logoUrl}" alt="Company Logo" style="max-width: 100%" /></div>`
        : `<div id="logo-block" class="logo-placeholder align-center">[ Click to Upload Logo ]</div>`
    );
  };

  const handleSave = async (overwrite = false) => {
    const rawHtml = editorRef.current.innerHTML;
    const finalHtml = replaceLogoPlaceholder(rawHtml, template.logoUrl);

    const payload = {
      ...template,
      contentHtml: finalHtml,
      createdBy: 'Current User',
      createOn: new Date().toISOString().split('T')[0]
    };
    const res = await saveTemplate(payload, overwrite ? templateId : null);
    onSaveComplete(res.id);
  };

  useEffect(() => {
    const editor = editorRef.current;

    const handleClick = (e) => {
      const el = e.target.closest('#logo-block');
      if (el) {
        logoInputRef.current?.click();
      }
    };

    if (editor) {
      editor.addEventListener('click', handleClick);
    }

    return () => {
      if (editor) {
        editor.removeEventListener('click', handleClick);
      }
    };
  }, []);

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
          onChange={(e) => {
            const logoBlock = document.getElementById('logo-block');
            if (logoBlock) {
              logoBlock.classList.remove('align-left', 'align-center', 'align-right');
              logoBlock.classList.add(e.target.value);
            }
          }}
        >
          <option value="align-left">Align Left</option>
          <option value="align-center">Align Center</option>
          <option value="align-right">Align Right</option>
        </select>
      </div>

      <div className="editor-canvas">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
        <input
          type="file"
          accept="image/*"
          ref={logoInputRef}
          style={{ display: 'none' }}
          onChange={handleLogoUpload}
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
        <button onClick={() => setShowPreview(true)}>Preview</button>
        <button onClick={() => handleSave(false)}>Save As New</button>
        <button onClick={() => handleSave(true)}>Save Changes</button>
        <button onClick={onCancel}>Discard</button>
      </div>

     {showPreview && (
        <PreviewModal
          template={{
            ...template,
            contentHtml: getPreviewContentHtml()  // ✅ live editor + logo processed
          }}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
