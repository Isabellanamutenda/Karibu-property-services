import React from 'react';
import '../../../styles/RenterStyles.css';

function FollowUpForm({ followupData, onChange, onSubmit, isLoading, statusMessage }) {
  return (
    <div className="followup-form-container">
      <h3>Follow-Up Complaint</h3>

      {statusMessage && (
        <div className={`status-message ${statusMessage.startsWith('Error') ? 'error' : 'success'}`}>
          {statusMessage}
        </div>
      )}

      <form>
        <label>Ticket ID</label>
        <input
          type="text"
          name="ticketId"
          value={followupData.ticketId}
          onChange={onChange}
          placeholder="Enter existing ticket ID"
          disabled={isLoading}
        />

        <label>Description (Add additional Information)</label>
        <textarea
          name="followupDescription"
          value={followupData.followupDescription}
          onChange={onChange}
          rows="3"
          placeholder="Add specific details or urgency update."
          disabled={isLoading}
        />

        <button type="button" onClick={onSubmit} disabled={isLoading}>
          SUBMIT FOLLOW-UP
        </button>
      </form>
    </div>
  );
}

export default FollowUpForm;
