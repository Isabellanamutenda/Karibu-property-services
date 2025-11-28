class RenameCaPasswordToCaPasswordDigest < ActiveRecord::Migration[7.1]
  def change
    rename_column :CA_InfoTable, :CA_Password, :CA_Password_digest
  end
end