# UberUber API Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [API Endpoints](#api-endpoints)

## Introduction
This document provides the API documentation for the UberUber API made with Elysia. The UberUber API is a RESTful API that allows users to request 'rides' (or more so, deliveries) from drivers. The API provides endpoints for users to create, read, update, and delete clients, drivers, and deliveries. The API also provides endpoints for users to add and remove drivers from a client's cart, as well as update the state of a delivery.

## API Endpoints
The UberUber API provides the following endpoints: 

### Clients
- `GET api/clients`: Get all clients
- `GET api/clients/:id`: Get a client by ID
- `POST api/clients`: Create a new client
- `DELETE api/clients/:id`: Delete a client by ID
- `GET api/clients/:id/deliveries`: Get all deliveries for a client by ID

### Clients & Carts
- `GET api/clients/:id/cart`: Get cart for a client by ID
- `POST api/clients/:id/cart/:driverId`: Add a driver to a client's cart by ID
- `DELETE api/clients/:id/cart/:driverId`: Remove a driver from a client's cart by ID

### Drivers
- `GET api/drivers`: Get all drivers
- `GET api/drivers/:id`: Get a driver by ID
- `POST api/drivers`: Create a new driver
- `DELETE api/drivers/:id`: Delete a driver by ID
- `GET api/drivers/:id/deliveries`: Get all rides for a driver by ID


### Deliveries
- `GET api/deliveries`: Get all deliveries
- `GET api/deliveries/:id`: Get a delivery by ID
- `POST api/deliveries`: Create a new delivery
- `PUT api/deliveries/:id/state`: Update a delivery state by ID


## Contributors
- [<img src="https://avatars.githubusercontent.com/u/113182098?v=4">](https://github.com/dalia-nezzar)
- [<img src="https://avatars.githubusercontent.com/u/53911681?v=4">](https://github.com/Witop-s)