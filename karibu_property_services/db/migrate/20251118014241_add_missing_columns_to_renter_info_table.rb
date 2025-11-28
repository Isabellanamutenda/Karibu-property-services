class AddMissingColumnsToRenterInfoTable < ActiveRecord::Migration[7.1]
  def change
    # Add the missing email column
    add_column :Renter_InfoTable, :Renter_Email, :string
    
    # Add the required secure password column
    add_column :Renter_InfoTable, :Renter_Password_digest, :string
    
    # Add index for uniqueness on email
    add_index :Renter_InfoTable, :Renter_Email, unique: true
  end
end
