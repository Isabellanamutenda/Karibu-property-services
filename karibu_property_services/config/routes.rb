# config/routes.rb
Rails.application.routes.draw do
  # --- CUSTOMER ASSISTANTS (Staff) ROUTES ---
  resources :customer_assistants, only: [:create] do
    post 'login', on: :collection
  end

  # --- RENTER/OWNER ROUTES ---
  resources :renters, only: [:index, :show, :update, :create] do
    post 'lodge_complaint', on: :member
    post 'login', on: :collection
  end

  # --- TICKETS ROUTES ---
  resources :tickets do
    # Nested follow-ups: /tickets/:ticket_id/follow_ups
    resources :follow_ups, only: [:create, :index]

    # Custom member routes
    patch 'follow_up', on: :member
    patch 'remove', on: :member

    # Custom collection routes
    get 'report', on: :collection
    get 'all', on: :collection
  end
end



# # config/routes.rb

# Rails.application.routes.draw do

#   # --- CUSTOMER ASSISTANTS (Staff) ROUTES ---
  
#   # Resource for Customer Assistants: Handles POST /customer_assistants (Signup)
#   resources :customer_assistants, only: [:create] do
#     # Custom route for Login: POST /customer_assistants/login
#     post 'login', on: :collection
#   end
  
#   # --- RENTER/OWNER ROUTES ---
  
#   # Resource for Renters: Handles Renter management (view, update) by CAs.
#   resources :renters, only: [:index, :show, :update] do
    
#     # Custom route for Complaint Lodging: POST /renters/:renter_id/lodge_complaint
#     # The 'on: :member' maps to a specific renter's ID.
#     post 'lodge_complaint', on: :member
    
#     # Custom route for Renter Login (separate from the resource's standard actions)
#     # The 'on: :collection' means the route applies to the collection of renters.
#     post 'login', on: :collection
#   end

#   # Optional: Define the root path (what happens when a user navigates to '/')
#   # root 'application#home' # Replace application#home with your preferred controller#action
# # RENTER routes (Add :index for viewing all renters)
#   resources :renters, only: [:index, :show, :update, :create] do
#     post 'lodge_complaint', on: :member
#     post 'login', on: :collection
#   end

#   # NEW: TicketsController routes
#   resources :tickets, only: [:index] do
#     patch 'follow_up', on: :member # PATCH /tickets/:id/follow_up
#     # Custom route for reporting
#     get 'report', on: :collection 
#     get 'all', on: :collection # GET /tickets/all
#     # Custom route for removing from queue
#     patch 'remove', on: :member # This will change the status from open to closed/resolved
#     patch 'follow_up', on: :member
#   end
#   # You may want a separate route for Renter Signup if you haven't handled it under a 'resources' block
#   # post '/renter/signup', to: 'renters#create'
# end