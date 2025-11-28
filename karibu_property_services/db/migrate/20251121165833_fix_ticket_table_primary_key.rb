# db/migrate/20251121165833_fix_ticket_table_primary_key.rb

class FixTicketTablePrimaryKey < ActiveRecord::Migration[7.1]
  def change
    # 1. Disable the foreign key check
    execute "SET FOREIGN_KEY_CHECKS=0;"
    
    # 2. FIX: Modify the column to INT NOT NULL AUTO_INCREMENT. 
    # We remove the PRIMARY KEY keyword because it already exists.
    execute "ALTER TABLE Ticket_Table MODIFY Ticket_ID INT NOT NULL AUTO_INCREMENT;"
    
    # 3. Enable the foreign key check
    execute "SET FOREIGN_KEY_CHECKS=1;"
  end
end