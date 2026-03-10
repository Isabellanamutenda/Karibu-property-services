# Karibu-property-services


## Table of Contents

- [About Project](#about-project)
- [Architecture & Logic] (#Architecture-&-Logic)
- [Built With](#built-with)
- [Contributing](#contributing)
- [Author](#author)
- [Show your support](#show-your-support)

## About Project

Karibu Property Services is a full-stack Management Information System (MIS) designed to digitize the interaction between tenants and property management. It replaces informal, manual complaint processes with a structured, ticket-based workflow to ensure transparency, accountability, and efficiency.

## Architecture & Logic
FIFO Implementation
The system ensures fairness by utilizing a First-In, First-Out algorithm. When a staff member views the "Pending" list, the Rails backend queries the database using order(created_at: :asc), ensuring the oldest complaints are addressed first.

Database Schema
The project uses a relational database structure:

Renters: Stores tenant profiles and authentication digests.

Issues: Stores the raw complaint data linked to a Renter.

Tickets: A tracking layer linked to an Issue that manages the lifecycle (Open, In-Progress, Resolved).

## Built With

- React.js
- React Hooks
- Ruby on Rails 8
- MySQL
- CSS


## ⚙️ Installation & Setup
## Backend (Rails)
Navigate to the server folder: cd karibu-property-services

Install dependencies: bundle install

Setup database: rails db:create db:migrate db:seed

Start server: rails s

## Frontend (React)
Navigate to the UI folder: cd karibu_ui

Install dependencies: npm install

Start the application: npm start


## Contributing

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](https://github.com/Isabellanamutenda/Final-react-capstone-project/issues)

  1. Fork the Project
  2. Create your Feature Branch (`git checkout -b feature/newFeature`)
  3. Commit your Changes (`git commit -m 'Add some newFeature'`)
  4. Push to the Branch (`git push -u origin feature/newFeature`)
  5. Open a Pull Request

## Author

👤 **Isabella Namutenda**

- GitHub: [Isabellanamutenda](https://github.com/Isabellanamutenda)
- Twitter: [@INamtenda](https://twitter.com/INamtenda)
- LinkedIn: [Isabella Namutenda](https://www.linkedin.com/in/isabella-namutenda/)




## Show your support

Give a ⭐️ if you like this project!

