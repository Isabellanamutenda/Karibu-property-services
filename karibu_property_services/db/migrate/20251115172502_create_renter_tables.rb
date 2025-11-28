class CreateRenterTables < ActiveRecord::Migration[8.0]
  def change
    create_table :renter_tables do |t|
      t.string :RenterName
      t.string :Email
      t.string :HouseNumber
      t.string :Password

      t.timestamps
    end
  end
end
