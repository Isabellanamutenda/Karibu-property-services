import React, { useState } from 'react';

function ViewTickets() {
  const [search, setSearch] = useState('');

  const tickets = [
    { property: 'Block C', id: 'T-212', status: 'Open', date: '11/10/2025', category: 'Cleaning' },
    { property: 'Block A', id: 'T-465', status: 'Closed', date: '5/10/2025', category: 'Plumbing' },
    { property: 'Block B', id: 'T-318', status: 'In progress', date: '8/10/2025', category: 'Electrical' },
  ];

  const filtered = tickets.filter(ticket =>
    ticket.id.toLowerCase().includes(search.toLowerCase()) ||
    ticket.property.toLowerCase().includes(search.toLowerCase()) ||
    ticket.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="panel">
      <h3>All Tickets</h3>

      <input
        type="text"
        placeholder="Search by Ticket ID, Property, or Category"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: '0.5rem',
          marginBottom: '1rem',
          width: '100%',
          borderRadius: '6px',
          border: '1px solid #ccc'
        }}
      />

      <table>
        <thead>
          <tr>
            <th>Property</th>
            <th>Ticket ID</th>
            <th>Status</th>
            <th>Date Created</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(ticket => (
            <tr key={ticket.id}>
              <td>{ticket.property}</td>
              <td>{ticket.id}</td>
              <td>{ticket.status}</td>
              <td>{ticket.date}</td>
              <td>{ticket.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewTickets;
