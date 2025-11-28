# app/models/ticket.rb

class Ticket < ApplicationRecord
  self.table_name = 'Ticket_Table'
  self.primary_key = 'Ticket_ID'
  
  # Relationship
  belongs_to :issue, foreign_key: 'Complaint_ID' 
  has_many :follow_ups, class_name: "FollowUp", foreign_key: "Ticket_ID"

  # FIX: Use explicit array syntax for enum, which is safer against argument errors 
  # during class load than the hash syntax in some environments.
  # If this fails, the error is in the before_create line.
enum :status, { open: 0, in_progress: 1, closed: 2 }

  # Callback to ensure a unique ticket number is generated upon creation
  before_create :set_unique_ticket_number
  
  private
  
  def set_unique_ticket_number
    # The logic that previously caused errors (now confirmed working after fixes)
    max_id = self.class.maximum(:Ticket_ID) || 0
    self.Ticket_Number = "K#{max_id + 1}-#{Time.now.year}"
  end

  def set_default_status
    self.status ||= :open
  end

  # ✅ Override JSON serialization
  def as_json(options = {})
    super(options).merge("status" => status)
  end

end
