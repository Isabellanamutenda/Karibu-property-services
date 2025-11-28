class CreateQueueTables < ActiveRecord::Migration[8.0]
  def change
    create_table :queue_tables do |t|
      t.integer :Queue_ID
      t.datetime :Queue_Date

      t.timestamps
    end
  end
end
