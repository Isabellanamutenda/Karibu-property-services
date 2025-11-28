# app/models/customer_assistant.rb

class CustomerAssistant < ApplicationRecord
  # Map to your existing table
  self.table_name = 'CA_InfoTable' 
  self.primary_key = 'CA_StaffNumber'

  # **CRUCIAL SECURITY CHANGE:** # Use bcrypt. This requires a database column named 'CA_Password_digest'.
  # If your column is 'CA_Password', you MUST rename it in the DB to 'CA_Password_digest' 
  # for has_secure_password to work securely.
  has_secure_password :CA_Password

  # Validations (Handles confirmation, presence, format, and uniqueness)
  validates :CA_StaffNumber, 
    presence: true, 
    uniqueness: { message: "Staff number already exists." }
    
  validates :CA_Name, presence: true

  validates :CA_Email, 
    presence: true, 
    format: { with: URI::MailTo::EMAIL_REGEXP }, 
    uniqueness: true

  validates :CA_Password,
    presence: true,
    length: { minimum: 8 },
    format: { with: /[A-Z]/, message: "must include a capital letter" },
    confirmation: true # Automatically checks against password_confirmation attribute
end