class Renter < ApplicationRecord
  self.table_name = 'Renter_InfoTable' 
  self.primary_key = 'Renter_IDNumber'
  
  # 1. SECURITY: Initialize has_secure_password without validations 
  # (since we are mapping the column manually)
  has_secure_password validations: false

  # 2. Relationship for Complaint Lodging
  has_many :issues, foreign_key: 'Renter_IDNumber', primary_key: 'Renter_IDNumber'

  # 3. MANUAL PASSWORD MAPPING
  # This fixes the "NoMethodError (undefined method password_digest=)"
  def password=(unencrypted_password)
    if unencrypted_password.present?
      @password = unencrypted_password
      # Manually hash and save to your custom column
      self.Renter_Password_digest = BCrypt::Password.create(unencrypted_password)
    end
  end

  # 4. CUSTOM AUTHENTICATION METHOD
  # This fixes the login logic to look at your custom column
  def authenticate_Renter_Password(unencrypted_password)
    if BCrypt::Password.new(self.Renter_Password_digest) == unencrypted_password
      self
    else
      false
    end
  end

  # --- NEW METHOD: updateRenterInfo() ---
  def updateRenterInfo(new_data)
    self.update(new_data)
  end

  # --- VALIDATIONS ---
  validates :Renter_Name, :Renter_Email, :Renter_IDNumber, :Renter_HseNumber, :Renter_Phone, presence: true
  validates :Renter_IDNumber, uniqueness: true
end