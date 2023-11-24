# Order Service with RabbitMQ Integration

Welcome to the Order Service with RabbitMQ Integration, a microservice implemented in Node.js that integrates with RabbitMQ. This service listens to the "order-service-queue" and creates orders in a MongoDB database based on received messages.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine.
- [npm](https://www.npmjs.com/) (Node Package Manager) for managing dependencies.
- [Docker](https://www.docker.com/) for containerization (to run RabbitMQ).
- [MongoDB](https://www.mongodb.com/) running and accessible.

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/alyona-shirpal/order-service-rabbitmq.git
    ```

2. **Navigate to the project directory:**

    ```bash
    cd order-service-rabbitmq
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```

### RabbitMQ Setup

1. **Run RabbitMQ container using Docker Compose:**

    ```bash
    docker-compose up -d
    ```

   This will start RabbitMQ with the configured ports, volumes, and networks.

2. **Connect to RabbitMQ:**

   Update the RabbitMQ connection configuration in `index.js`:

    ```javascript
    const amqpServer = "amqp://guest:guest@localhost:5673";
    ```

### MongoDB Setup

1. **Ensure MongoDB is running:**

   Make sure MongoDB is running and accessible. Update the MongoDB connection configuration in `index.js` if needed.

    ```javascript
    mongoose.connect("mongodb://docker:mongopw@localhost:55002", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Order service connected to MongoDB'))
    .catch((e) => console.log(e));
    ```

### Usage

1. **Run the development server:**

    ```bash
    npm run start
    ```

   The Order service will start listening on the configured port (default: 3002).

2. **Integration with RabbitMQ:**

    - The service listens to the "order-service-queue" on RabbitMQ.
    - When a message is received, the service creates an order in MongoDB.
    - The new order is then sent to the "product-service-queue" on RabbitMQ.

### Contributing

Feel free to contribute to the development of this project. Create a fork, make your changes, and submit a pull request.

