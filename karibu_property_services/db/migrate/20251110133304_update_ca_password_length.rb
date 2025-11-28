class UpdateCaPasswordLength < ActiveRecord::Migration[8.0]
  def change
  change_column :CA_InfoTable, :CA_Password, :string, limit: 64
end

end
