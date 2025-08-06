// src/App.js
import React, { useState } from 'react';
import OfferLetterListPage from './components/OfferLetterListPage';
import OfferLetterEditor from './components/OfferLetterEditor';
import '@fortawesome/fontawesome-free/css/all.min.css';


function App() {
  const [mode, setMode] = useState('list');
  const [currentId, setCurrentId] = useState(null);

  return (
    <div>
      {mode === 'list' && <OfferLetterListPage onEdit={(id) => {
        setCurrentId(id); setMode('edit');
      }} />}
      {mode === 'edit' && (
        <OfferLetterEditor
          templateId={currentId}
          onSaveComplete={() => {
            setMode('list');
            setCurrentId(null);
          }}
          onCancel={() => { setMode('list'); setCurrentId(null); }}
        />
      )}
    </div>
  );
}

export default App;
