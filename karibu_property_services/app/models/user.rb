class User
  # === Attributes ===
  attr_accessor :renter_name, :renter_hse_number, :renter_id_number,
                :renter_phone, :renter_date_of_rent, :renter_date_of_vacating

  attr_reader :ca_staff_number, :ca_name, :ca_email
  attr_accessor :ca_password

  def initialize(user_type)
    @user_type = user_type  # "staff" or "renter"
  end

  # === Public Methods ===

  def signup(details)
    if !details_complete?(details) || !password_strong?(details[:password])
      return "Details Incomplete or Password is weak"
    end

    if @user_type == "staff"
      create_staff(details)
      "Signup successful — redirecting to staff login"
    else
      create_renter(details)
      "Signup successful — redirecting to tenant login"
    end
  end

  def login(email, password)
    # Simulated login logic
    if password == "Secret123"  # Replace with real password check
      "Login successful"
    else
      "Invalid credentials"
    end
  end

  def update_renter_info(new_info)
    @renter_name = new_info[:name]
    @renter_phone = new_info[:phone]
    @renter_date_of_vacating = new_info[:vacate_date]
    "Renter info updated"
  end

  # === Private Methods ===
  private

  def details_complete?(details)
    required = [:name, :email, :password]
    required.all? { |field| details[field] && !details[field].empty? }
  end

  def password_strong?(password)
    password.length >= 8 && password.match(/[A-Z]/)
  end

  def create_staff(details)
    @ca_staff_number = rand(100000..999999)
    @ca_name = details[:name]
    @ca_email = details[:email]
    @ca_password = hash_password(details[:password])
    # Simulate DB insert here
  end

  def create_renter(details)
    @renter_name = details[:name]
    @renter_hse_number = details[:house_number]
    @renter_id_number = details[:id_number]
    @renter_phone = details[:phone]
    @renter_date_of_rent = details[:rent_date]
    @renter_date_of_vacating = details[:vacate_date]
    # Simulate DB insert here
  end

  def hash_password(password)
    # Simulated hash
    "hashed_#{password}"
  end
end
