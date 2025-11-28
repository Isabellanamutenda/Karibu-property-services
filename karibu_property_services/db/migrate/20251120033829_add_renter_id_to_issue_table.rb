class AddRenterIdToIssueTable < ActiveRecord::Migration[7.1]
  def change
    # Add the missing foreign key column
    add_column :Issue_Table, :Renter_IDNumber, :string, null: false

    # Optional: Add an index for faster lookups
    add_index :Issue_Table, :Renter_IDNumber
  end
end