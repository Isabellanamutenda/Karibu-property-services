// src/components/pages/dashboard/MainPanel.jsx

import React from 'react';

// Import Panel Components
import RenterInfoPanel from './panels/RenterInfoPanel'; 
import ReportPanel from './panels/ReportPanel'; 
import AllTicketsPanel from './panels/AllTicketsPanel'; // NEW: For displaying all statuses

// Note: Ensure the handleTicketRemove and handleRenterUpdate handlers are passed through
function MainPanel({ active, data, handleTicketRemove, handleRenterUpdate }) {
    
    const defaultContent = <div className="panel-content empty-state">Please select a section from the sidebar.</div>;

    const panelMap = {
    
        // --- NEW: ALL TICKETS LIST (Use a new ID, like 'all_tickets') ---
        'all_tickets_list': (
            <AllTicketsPanel /> // This component handles its own fetching (GET /tickets/all)
        ),

        // 🏠 Renters/Owners Info
        'renters': (
            <RenterInfoPanel 
                renterData={data.renters} 
                handleRenterUpdate={handleRenterUpdate}
            />
        ),

        // 📈 Generate Reports
        'reports': (
            <ReportPanel 
                reportData={data.report}
            />
        ),
    };
    
    // Look up the component to render based on the active state
    const activePanelComponent = panelMap[active];

    return (
        <div className="main-panel-container">
            {activePanelComponent || defaultContent}
        </div>
    );
}

export default MainPanel;
