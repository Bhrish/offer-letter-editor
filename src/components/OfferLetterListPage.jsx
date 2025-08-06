import React, { useEffect, useState } from 'react';
import { fetchTemplates } from '../api';
import './OfferLetterListPage.css';

export default function OfferLetterListPage({ onEdit }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetchTemplates().then(setList);
  }, []);

  return (
    <div className="offer-container">
      <div className="offer-header">
        <h1>
          <span className="highlight-yellow">Offer</span> Latter
        </h1>
        <button className="new-template-btn" onClick={() => onEdit(null)}>New Template</button>
      </div>

      <div className="offer-table-wrapper">
        <table className="offer-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Create on</th>
              <th>Created by</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map(t => (
              <tr key={t.id}>
                <td>
                  <span className="offer-badge">Offer</span>
                  <span className="offer-name">Letter | {t.name}</span>
                </td>
                <td>{t.createOn}</td>
                <td>{t.createdBy}</td>
                <td className="offer-actions">
                  <button className="icon-btn" title="Edit" onClick={() => onEdit(t.id)}>
                    <i className="fas fa-pen"></i>
                  </button>
                  <button className="icon-btn delete" title="Delete">
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="offer-footer">
        <div className="offer-results">
          Result per page
          <select defaultValue="50">
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div>1-50 of {list.length}</div>
        <div className="pagination-icons">
          <span>&laquo;</span>
          <span>&lsaquo;</span>
          <span>&rsaquo;</span>
          <span>&raquo;</span>
        </div>
      </div>
    </div>
  );
}
