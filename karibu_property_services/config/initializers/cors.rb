Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*' # You can restrict this to your frontend domain later
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
