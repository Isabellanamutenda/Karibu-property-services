// src/components/pages/dashboard/panels/ReportPanel.jsx

import React from 'react';

function ReportPanel({ reportData }) {
    // UI Logic: This panel will eventually show charts and summary tables
    return (
        <div className="report-panel-container">
            <h3>Generated Reports</h3>
            <p>Total Open Tickets: {reportData?.open_tickets || 0}</p>
            <p>Total Closed Tickets: {reportData?.closed_tickets || 0}</p>
            <p>Report generation logic will go here.</p>
        </div>
    );
}

export default ReportPanel;
