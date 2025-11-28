# app/controllers/renters_controller.rb

class RentersController < ApplicationController
  skip_before_action :verify_authenticity_token 
  before_action :authenticate_ca!, only: [:index, :update] # Protect management actions

  # --- PUBLIC ACTIONS ---

  # GET /renters
def index
  # Must be protected by before_action :authenticate_ca!
  @renters = Renter.order(:Renter_HseNumber)
  
  render json: @renters.map { |r| 
    r.slice(:Renter_IDNumber, :Renter_Name, :Renter_HseNumber, :Renter_Phone, :Renter_DateofVacating) 
  }, status: :ok
end

# GET /renters/:renter_id/status
def status
    # This logic calculates the Renter's queue position and provides necessary details.
    @renter = Renter.find_by(Renter_IDNumber: params[:id]) # Uses :id parameter
    
    # ... (Authentication/Authorization omitted for brevity) ...

    # 1. Find the Renter's latest open ticket 
    latest_open_ticket = @renter.issues
                                .joins(:ticket) 
                                .where(tickets: { status: :open })
                                .order(created_at: :desc)
                                .first
    
    if latest_open_ticket.nil?
        render json: { status_message: "You have no active complaints in the queue.", is_active: false }, status: :ok and return
    end

    # 2. Calculate Queue Position (FIFO)
    active_queue_ids = Ticket.where(status: :open)
                             .order(created_at: :asc)
                             .pluck(:Ticket_Number) # Get visible Ticket_Number array

    ticket_number_to_find = latest_open_ticket.ticket.Ticket_Number
    queue_position_index = active_queue_ids.index(ticket_number_to_find)

    # 3. Prepare Response Data
    render json: {
        is_active: true,
        ticket_number: ticket_number_to_find,
        category: latest_open_ticket.Complaint_Category,
        lodged_date: latest_open_ticket.created_at.strftime("%Y-%m-%d %H:%M"),
        queue_rank: queue_position_index ? queue_position_index + 1 : nil, 
        total_in_queue: active_queue_ids.count
    }, status: :ok
end
  
  # POST /renters (Renter Signup)
  def create
    @renter = Renter.new(renter_signup_params)
    
    if @renter.save
      render json: { success: true, message: "Renter account created successfully! Please log in.", redirect: "/renter/login" }, status: :created
    else
      render json: { success: false, error: @renter.errors.full_messages.join(", ") }, status: :unprocessable_entity
    end
  end
  
  # POST /renters/login
  def login
    @renter = Renter.find_by(Renter_IDNumber: params[:renter_id_number])
    
    if @renter && @renter.authenticate_Renter_Password(params[:password])
      render json: {
        success: true,
        message: "Welcome, #{@renter.Renter_Name}!",
        redirect: "/renter/dashboard",
        renter_id: @renter.Renter_IDNumber,
        renter_name: @renter.Renter_Name
      }, status: :ok
    else
      render json: { success: false, error: "Invalid ID Number or Password." }, status: :unauthorized
    end
  end

  # POST /renters/:id/lodge_complaint
  def lodge_complaint
    # 1. Authorization: Use params[:id] (the route parameter)
    renter_id_string = params[:id].to_s 
    @renter = Renter.find_by(Renter_IDNumber: renter_id_string) 
    
    unless @renter
        render json: { error: "Renter not found or unauthorized." }, status: :unauthorized and return
    end
    
    # 2. Map and prepare the validated complaint data (fixes attribute naming)
    complaint_data = map_complaint_params(complaint_params)

    # 3. Transaction: Create Issue and automatically link a Ticket
    Issue.transaction do
        @issue = @renter.issues.create!(complaint_data)
        
        # FIX: Explicitly set the status to :open when creating the ticket.
    @ticket = Ticket.create!(issue: @issue, status: :open)
    end
    
    # 4. Success Response
    render json: {
        success: true,
        message: "Complaint successfully lodged.",
        ticket_number: @ticket.Ticket_Number,
        queue_message: "Your request has been placed in the FIFO queue."
    }, status: :created
    
rescue ActiveRecord::RecordInvalid => e
    render json: { error: "Failed to lodge complaint: #{e.record.errors.full_messages.join(', ')}" }, status: :unprocessable_entity
rescue => e
    render json: { error: "An unexpected server error occurred: #{e.message}" }, status: :internal_server_error
end

def update
    # 1. Find the Renter based on the ID passed in the URL
    @renter = Renter.find_by(Renter_IDNumber: params[:id])

    unless @renter
      render json: { error: "Renter not found." }, status: :not_found and return
    end
    
    # 2. Extract and map the permitted parameters
    # The 'renter_update_params' method (to be added to private) is key here.
    permitted_data = renter_update_params 
    
    # 3. Business Logic: Call the updateRenterInfo method on the Renter object
    # This fulfills the lecturer's requirement for the Renter class to "own" the update method.
    if @renter.updateRenterInfo(permitted_data) 
      render json: { 
        message: "Renter information updated successfully.",
        renter: @renter.slice(:Renter_Name, :Renter_HseNumber, :Renter_Phone, :Renter_DateofVacating)
      }, status: :ok
    else
      render json: { 
        error: @renter.errors.full_messages.join(", ") 
      }, status: :unprocessable_entity
    end
  end

  # ... other actions ...

  private

 # NOTE: In a production app, this would decode a JWT token from the request header.
def current_ca
  # For testing purposes, we rely on a stored CA ID or a simple lookup.
  # We'll use the find_by lookup for simplicity, assuming a CA is always present for testing.
  CustomerAssistant.find_by(CA_StaffNumber: 3002) # Use a known, existing CA ID for testing
end

# 2. Enforces authentication by checking if current_ca exists
def authenticate_ca!
  unless current_ca
    # If not authenticated, halt execution and return 401
    render json: { error: "Authentication Required. Access Denied." }, status: :unauthorized 
    return false
  end
  true
end
  
  # Strong Parameters for Complaint Lodging
  def complaint_params
    params.require(:complaint).permit(
      :heading, :description, :category
    )
  end

  # Maps frontend keys to database column names
  def map_complaint_params(permitted_params)
      mapped_params = {}
      mapped_params[:Complaint_Heading] = permitted_params[:heading]
      mapped_params[:Complaint_Description] = permitted_params[:description]
      mapped_params[:Complaint_Category] = permitted_params[:category]
      mapped_params[:Complaint_DateTime] = Time.zone.now
      return mapped_params
  end

  # Strong Parameters for Signup
  def renter_signup_params
    params.permit(
      :renter_name, :renter_hse_number, :renter_id_number, :renter_phone,
      :password, :password_confirmation
    ).tap do |p|
      p[:Renter_Name] = p.delete(:renter_name) if p[:renter_name].present?
      p[:Renter_HseNumber] = p.delete(:renter_hse_number) if p[:renter_hse_number].present?
      p[:Renter_IDNumber] = p.delete(:renter_id_number) if p[:renter_id_number].present?
      p[:Renter_Phone] = p.delete(:renter_phone) if p[:renter_phone].present?
      
      p[:Renter_Password] = p.delete(:password) if p[:password].present?
      p[:Renter_Password_confirmation] = p.delete(:password_confirmation) if p[:password_confirmation].present?
    end
  end
  
  # Strong Parameters for Login
  def renter_login_params
    params.permit(:renter_id_number, :password)
  end

  def renter_update_params
    # Permitting the fields shown in the CA Dashboard UI:
    params.permit(
      :Renter_Name, 
      :Renter_HseNumber, 
      :Renter_Phone, 
      :Renter_DateofVacating
    )
  end
end
