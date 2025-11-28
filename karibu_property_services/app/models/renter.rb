# app/models/renter.rb

class Renter < ApplicationRecord
  self.table_name = 'Renter_InfoTable' 
  self.primary_key = 'Renter_IDNumber'
  
  # SECURITY: This creates the authentication methods (requires Renter_Password_digest column)
  has_secure_password :Renter_Password 

  # Relationship for Complaint Lodging
  has_many :issues, foreign_key: 'Renter_IDNumber', primary_key: 'Renter_IDNumber'

  # --- NEW METHOD: updateRenterInfo() (Public Instance Method) ---
  
  # Fulfills lecturer's requirement for the Renter class to own the update logic.
  # This method is called by the CustomerAssistantsController#update.
  def updateRenterInfo(new_data)
    # ActiveRecord update method to apply changes to the Renter record
    self.update(new_data)
  end

  # --- VALIDATIONS (Backend Logic) ---
  validates :Renter_IDNumber, presence: true, uniqueness: true
  validates :Renter_HseNumber, presence: true, uniqueness: true
  validates :Renter_Email, presence: true, uniqueness: true
  validates :Renter_Name, presence: true
  validates :Renter_Phone, presence: true
  
  # Renter_Password validation is handled by has_secure_password
end
