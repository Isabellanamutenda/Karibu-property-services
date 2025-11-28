# db/migrate/20251120034209_fix_issue_table_primary_key.rb

class FixIssueTablePrimaryKey < ActiveRecord::Migration[7.1]
  def change
    # 1. Disable the foreign key check to allow modifying the column
    execute "SET FOREIGN_KEY_CHECKS=0;"
    
    # 2. FIX: Modify the column to INT NOT NULL AUTO_INCREMENT
    # (Assuming the PRIMARY KEY is already defined, as per the previous error)
    execute "ALTER TABLE Issue_Table MODIFY Complaint_ID INT NOT NULL AUTO_INCREMENT;"
    
    # 3. Enable the foreign key check to restore database integrity
    execute "SET FOREIGN_KEY_CHECKS=1;"
  end
end
