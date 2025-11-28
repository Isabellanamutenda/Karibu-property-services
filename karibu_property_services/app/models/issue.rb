# app/models/issue.rb

class Issue < ApplicationRecord
  self.table_name = 'Issue_Table'
  self.primary_key = 'Complaint_ID' # Assuming Complaint_ID is your auto-incrementing PK
  
  # Relationships
  # The foreign_key points to the Renter's ID column in the Issue_Table
  belongs_to :renter, foreign_key: 'Renter_IDNumber', primary_key: 'Renter_IDNumber' 
  has_one :ticket, foreign_key: 'Complaint_ID' 
  
  # Validations (Backend Logic)
  validates :Complaint_Heading, presence: true
  validates :Complaint_Description, presence: true
  validates :Complaint_Category, presence: true
end
