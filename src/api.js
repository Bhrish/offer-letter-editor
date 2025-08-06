// src/api.js
let templates = [
  { id: 1, name: 'Junior | Dubai', content: '<p>Dear Candidate …</p>', meta: { candidateName: 'Aditya Sharma', position: 'UX Designer' }, createdBy: 'Ayushi Tiwari', createOn: '2025‑04‑16' }
];

export function fetchTemplates() {
  return Promise.resolve([...templates]);
}
export function fetchTemplateById(id) {
  const t = templates.find(t => t.id === id);
  return Promise.resolve(t ? { ...t } : null);
}
export function saveTemplate(template, overwriteId = null) {
  if (overwriteId) {
    templates = templates.map(t => t.id === overwriteId ? { ...t, ...template } : t);
    return Promise.resolve({ id: overwriteId });
  } else {
    const newId = templates.length + 1;
    templates.push({ id: newId, ...template });
    return Promise.resolve({ id: newId });
  }
}
