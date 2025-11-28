class UserController < ApplicationController
  # This should ideally be scoped to CustomerAssistantsController, but we'll adapt yours.

  def signup
    # 1. Create a new instance with permitted parameters
    @ca = CaInfoTable.new(ca_params)

    # 2. Attempt to save
    if @ca.save
      render json: {
        message: "Signup successful",
        redirect: "/staff/login",
        staff_name: @ca.CA_Name
      }, status: :created
    else
      # Handle validation errors automatically
      render json: { error: @ca.errors.full_messages.join(", ") }, status: :unprocessable_entity
    end
  end

  private

  # 3. Use Strong Parameters for security
  def ca_params
    params.permit(
      :CA_StaffNumber,
      :CA_Name,
      :CA_Email,
      :CA_Password,
      :CA_Password_confirmation # This is what 'confirmation: true' checks against
    ).with_defaults(user_type: 'customer_assistant') # Optional: ensure type is set
  end
end