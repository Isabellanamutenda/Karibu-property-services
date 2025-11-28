# Note: Assuming you map database column names to attribute names
class CaInfoTable < ApplicationRecord
  # 1. Security: Use bcrypt for secure password hashing
  # Requires a database column named 'CA_Password_digest'
  has_secure_password :CA_Password

  # 2. Validation (Handles confirmation, presence, length, format)
  validates :CA_StaffNumber, presence: true, uniqueness: true
  validates :CA_Email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }, uniqueness: true
  validates :CA_Password,
    presence: true,
    length: { minimum: 8 },
    format: { with: /[A-Z]/, message: "must include a capital letter" },
    confirmation: true # Automatically checks against password_confirmation attribute

end