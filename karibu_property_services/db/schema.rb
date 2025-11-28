# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_11_21_165833) do
  create_table "CA_InfoTable", primary_key: "CA_StaffNumber", id: :integer, default: nil, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "CA_Name", limit: 50
    t.string "CA_Email"
    t.string "CA_Password_digest", limit: 64
  end

  create_table "Issue_Table", primary_key: "Complaint_ID", id: :integer, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "Complaint_Heading", limit: 45
    t.string "Complaint_Description"
    t.string "Complaint_Category", limit: 25
    t.datetime "Complaint_DateTime", precision: nil
    t.string "Renter_IDNumber", null: false
    t.index ["Renter_IDNumber"], name: "index_Issue_Table_on_Renter_IDNumber"
  end

  create_table "Queue_Table", id: false, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "Queue_ID"
    t.datetime "Queue_Date", precision: nil
  end

  create_table "Renter_InfoTable", primary_key: "Renter_IDNumber", id: :integer, default: nil, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "Renter_Name", limit: 100
    t.string "Renter_HseNumber", limit: 25
    t.integer "Renter_Phone"
    t.datetime "Renter_DateofRent", precision: nil
    t.datetime "Renter_DateofVacating", precision: nil
    t.string "Renter_Email"
    t.string "Renter_Password_digest"
    t.index ["Renter_Email"], name: "index_Renter_InfoTable_on_Renter_Email", unique: true
  end

  create_table "Ticket_Table", primary_key: "Ticket_ID", id: :integer, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "Ticket_Number", limit: 50
    t.integer "Complaint_ID"
    t.integer "CA_StaffNumber"
    t.integer "Queue_ID"
    t.integer "status", default: 0, null: false
    t.index ["Complaint_ID"], name: "fk_complaint"
  end

  create_table "queue_tables", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "Queue_ID"
    t.datetime "Queue_Date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "renter_info_tables", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "renter_tables", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "RenterName"
    t.string "Email"
    t.string "HouseNumber"
    t.string "Password"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "Ticket_Table", "Issue_Table", column: "Complaint_ID", primary_key: "Complaint_ID", name: "fk_complaint", on_update: :cascade, on_delete: :cascade
end
