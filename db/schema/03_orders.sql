DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
                        id SERIAL PRIMARY KEY NOT NULL,
                        customer_id INT NOT NULL REFERENCES users(id),
                        created_at TIMESTAMP NOT NULL DEFAULT now(),
                        accepted_at TIMESTAMP NOT NULL DEFAULT now(),
                        completed_at TIMESTAMP
);
