import { useEffect, useState } from 'react';
import Header from '../../../components/common/Header';
import Sidebar from '../../../components/common/Sidebar';
import MainPanel from './MainPanel';
import { staffSidebar } from './SidebarConfig';
import { fetchDashboardData, removeTicket, updateRenterInfo } from '../../../services/dashboardService';
import '../../../styles/DashboardStyles.css';
import '../../../styles/SidebarStyles.css';

function StaffDashboard() {
  const [activePanel, setActivePanel] = useState('tickets');
  const [staffInfo, setStaffInfo] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    renters: [],
    tickets: [],
    report: {}
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = async () => {
    setIsLoading(true);
    const result = await fetchDashboardData();
    if (result.success) {
      setDashboardData({
        renters: result.renters,
        tickets: result.tickets,
        report: result.report
      });
    } else {
      console.error("Dashboard load failed:", result.error);
    }
    setIsLoading(false);
  };

  const handleTicketRemove = async (ticketId) => {
    const confirmRemove = window.confirm(`Are you sure you want to close Ticket ID ${ticketId}?`);
    if (!confirmRemove) return;
    const result = await removeTicket(ticketId);
    if (result.success) {
      alert(result.message);
      loadDashboard();
    } else {
      alert(result.error || "Failed to remove ticket.");
    }
  };

  const handleRenterUpdate = async (renterId, updatedData) => {
    const result = await updateRenterInfo(renterId, updatedData);
    if (result.success) {
      alert(result.message);
      loadDashboard();
    } else {
      alert(result.error || "Failed to update renter info.");
    }
  };

  useEffect(() => {
    const storedStaffNumber = localStorage.getItem("staffNumber");
    const storedStaffName = localStorage.getItem("staffName");

    if (!storedStaffNumber) {
      console.error("Staff not authenticated.");
      setIsLoading(false);
      return;
    }

    setStaffInfo({ name: storedStaffName || "Customer Assistant" });
    loadDashboard();
  }, []);

  if (isLoading) return <div className="loading-screen">Loading Karibu Dashboard...</div>;

  return (
    <div className="app-container">
      {/* Top Banner */}
      <div className="top-banner">
        Supervision Meeting: Tuesday, 21-Oct-2025, 8am - 10/21/2025
      </div>

      {/* Header with Profile Icon */}
      <Header staff={staffInfo} />

      <div className="body-wrapper">
        <Sidebar options={staffSidebar} onSelect={setActivePanel} active={activePanel} />

        <div className="main-panel-container">
          <MainPanel
            active={activePanel}
            data={dashboardData}
            handleTicketRemove={handleTicketRemove}
            handleRenterUpdate={handleRenterUpdate}
          />
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;
