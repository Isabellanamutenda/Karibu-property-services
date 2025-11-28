class CreateRenterInfoTable < ActiveRecord::Migration[8.0]
  def change
    create_table :renter_info_tables do |t|
      t.timestamps
    end
  end
end
