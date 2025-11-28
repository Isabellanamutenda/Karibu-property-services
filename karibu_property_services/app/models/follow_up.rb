# app/models/follow_up.rb
class FollowUp < ApplicationRecord
  self.table_name = 'FollowUp_Table'
  self.primary_key = 'FollowUp_ID'

  belongs_to :ticket, class_name: "Ticket", foreign_key: "Ticket_ID"
end
