# app/controllers/customer_assistants_controller.rb

class CustomerAssistantsController < ApplicationController

    skip_before_action :verify_authenticity_token

    # --- PUBLIC ACTIONS (MAPPABLE BY ROUTER) ---
    
    # POST /customer_assistants (Signup)
    def create
        @ca = CustomerAssistant.new(ca_params)

        if @ca.save
            render json: {
                success: true,
                message: "Customer Assistant Signup successful!",
                redirect: "/staff/login",
                staff_name: @ca.CA_Name
            }, status: :created
        else
            render json: { 
                success: false,
                error: @ca.errors.full_messages.join(", ") 
            }, status: :unprocessable_entity
        end
    end
    
    # POST /customer_assistants/login (Login)
    # ✅ FIX: This method is now correctly placed in the public section.
    def login
        @ca = CustomerAssistant.find_by(CA_StaffNumber: params[:staff_number])
        
        # Note: Must use @ca.authenticate_CA_Password(params[:password]) due to non-standard column name
        if @ca && @ca.authenticate_CA_Password(params[:password])
            render json: { 
                success: true, 
                message: "Welcome back, #{@ca.CA_Name}!", 
                redirect: "/staff/dashboard", 
                staff_name: @ca.CA_Name, 
                staff_staff_number: @ca.CA_StaffNumber 
            }, status: :ok
        else
            render json: { 
                success: false, 
                error: "Invalid Staff Number or Password." 
            }, status: :unauthorized
        end
    end

    # --- PRIVATE METHODS (HELPER METHODS) ---
    private

    # Strong Parameters: Maps incoming frontend keys to model attributes
    def ca_params
        params.permit(
            :staff_number,
            :name,
            :email,
            :password,
            :password_confirmation
        ).tap do |p|
            # Mapping logic for non-standard DB columns and bcrypt accessors
            p[:CA_StaffNumber] = p.delete(:staff_number) if p[:staff_number].present?
            p[:CA_Name] = p.delete(:name) if p[:name].present?
            p[:CA_Email] = p.delete(:email) if p[:email].present?
            
            p[:CA_Password] = p.delete(:password) if p[:password].present?
            p[:CA_Password_confirmation] = p.delete(:password_confirmation) if p[:password_confirmation].present?
        end
    end

end
