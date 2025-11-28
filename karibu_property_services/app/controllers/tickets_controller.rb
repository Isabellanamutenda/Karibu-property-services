# app/controllers/tickets_controller.rb

class TicketsController < ApplicationController
  # Ensure the CSRF token check is skipped for API requests
  skip_before_action :verify_authenticity_token 
  
  # Protect all management and data retrieval actions
  before_action :authenticate_ca!, only: [:index, :remove, :all, :report]

  # --- PUBLIC ACTIONS (Mappable by Router) ---

  # PATCH /tickets/:id/follow_up (Used by Renter for adding notes)
  def follow_up
    # The router provides the Ticket_Number in params[:id]
    @ticket = Ticket.find_by(Ticket_Number: params[:id]) 

    unless @ticket
      render json: { error: "Ticket not found or is invalid." }, status: :not_found and return
    end
    
    # Extract permitted data
    permitted_params = follow_up_params
    new_description = permitted_params[:description]
    timestamp = Time.zone.now.strftime('[%Y-%m-%d %H:%M]')
    
    # 3. Business Logic: Append new information
    original_description = @ticket.issue.Complaint_Description || ""
    updated_text = "#{original_description}\n\n--- FOLLOW UP #{timestamp} ---\n#{new_description}"
    
    # 4. Update the related Issue record (data persistence)
    if @ticket.issue.update(Complaint_Description: updated_text)
      render json: { 
        success: true, 
        message: "Follow-up added to Ticket #{@ticket.Ticket_Number}.",
        ticket_number: @ticket.Ticket_Number
      }, status: :ok
    else
      render json: { 
        error: "Failed to update follow-up." 
      }, status: :unprocessable_entity
    end
  end

  # PATCH /tickets/:id/remove (Executed when CA clicks Remove/Close)
  def remove
    # The router provides the Ticket_ID (Primary Key) in params[:id]
    @ticket = Ticket.find_by(Ticket_ID: params[:id])
    
    unless @ticket
      render json: { error: "Ticket not found." }, status: :not_found and return
    end
    
    # Update status from 'open' to 'closed'
    if @ticket.update(status: :closed)
      render json: { 
        success: true, 
        message: "Ticket #{@ticket.Ticket_Number} successfully closed and removed from the active queue." 
      }, status: :ok
    else
      render json: { 
        error: @ticket.errors.full_messages.join(", ") 
      }, status: :unprocessable_entity
    end
  end

  # GET /tickets (FIFO Queue - Open tickets only)
  def index
    @queue = Ticket
             .includes(:issue) 
             .references(:issue) 
             .where(status: :open)
             .order("Issue_Table.Complaint_DateTime ASC")

    ticket_data = @queue.map do |ticket|
      {
        ticket_id: ticket.Ticket_ID,
        ticket_number: ticket.Ticket_Number,
        status: ticket.status.capitalize,
        created_at: ticket.issue.Complaint_DateTime&.strftime("%Y-%m-%d %H:%M"),
        category: ticket.issue.Complaint_Category,
        description: ticket.issue.Complaint_Description,
        hse_number: ticket.issue.renter&.Renter_HseNumber, # Safe navigation for nil Renter
        renter_name: ticket.issue.renter&.Renter_Name 
      }
    end
    render json: ticket_data, status: :ok
  end
  
  # GET /tickets/report (Report Data)
  def report
    open_count = Ticket.where(status: :open).count
    closed_count = Ticket.where(status: :closed).count
    
    render json: {
      open_tickets: open_count,
      closed_tickets: closed_count,
      total_tickets: open_count + closed_count
    }, status: :ok
  end

  # GET /tickets/all (Comprehensive List - Used for search/view all)
  def all
    @tickets = Ticket.includes(:issue, issue: :renter) # Eager load Renter through Issue
                     .references(:issue) 
                     .order("Issue_Table.Complaint_DateTime DESC") # Sort by newest first

    if params[:search].present?
        search_term = "%#{params[:search].downcase}%"
        @tickets = @tickets.where(
            "LOWER(Ticket_Number) LIKE :search OR " +
            "LOWER(Issue_Table.Complaint_Category) LIKE :search", 
            search: search_term
        )
    end
    
    ticket_data = @tickets.map do |ticket|
        {
            id: ticket.Ticket_ID,
            ticket_id: ticket.Ticket_Number,
            status: ticket.status.capitalize,
            date: ticket.issue.Complaint_DateTime&.strftime("%d/%m/%Y"), 
            category: ticket.issue.Complaint_Category,
            property: ticket.issue.renter&.Renter_HseNumber, 
            renter_name: ticket.issue.renter&.Renter_Name 
        }
    end

    render json: { tickets: ticket_data }, status: :ok
  end

  # --- PRIVATE METHODS (Helper Functions) ---
  private
  
  # Required to satisfy the before_action :authenticate_ca!
  def authenticate_ca!
    unless current_ca
      render json: { error: "Authentication Required. Access Denied." }, status: :unauthorized and return
    end
    true
  end
  
  # Strong Parameters for Follow-up Submission
  def follow_up_params
    # FIX: Use require to ensure the payload is nested correctly under 'follow_up'
    params.require(:follow_up).permit(:description) 
  end
end
