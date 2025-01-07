import { Elysia } from "elysia";
import { db } from './database'
import { v4 as uuid } from 'uuid'
import { RowDataPacket, ResultSetHeader } from 'mysql2'
import { swagger } from '@elysiajs/swagger'



// Types pour les résultats MySQL
interface ClientRow extends RowDataPacket {
    id_client: string;
    firstname: string;
    lastname: string;
    email: string;
    birthdate: Date;
    image_url: string;
    is_alive: boolean;
    allow_criminal_record: boolean;
    wants_extra_napkins: boolean;
    created_at: Date;
}

interface DriverRow extends RowDataPacket {
    id_driver: string;
    firstname: string;
    lastname: string;
    email: string;
    price: number;
    image_url: string;
    has_criminal_record: boolean;
    has_driving_licence: boolean;
    days_since_last_accident: number;
    description: string;
    created_at: Date;
}

interface DeliveryRow extends RowDataPacket {
    id_delivery: string;
    delivery_date: string;
    total_price: number;
    state: string;
    id_client: string;
    created_at: Date;
}

interface PriceSum extends RowDataPacket {
    total: number;
}

const app = new Elysia()

    .onError(({ code, error }) => {
        return new Response(JSON.stringify({
            status: 'error',
            message: error.message
        }), { status: code === 'NOT_FOUND' ? 404 : 500 })
    })

    .use(
        swagger(
            {
                documentation: {
                    info: {
                        title: 'UberUber API',
                        description: 'API for UberUber, the Uber for Uber, to manage clients, drivers and deliveries.',
                        version: '1.0.0'
                    }
                }
            }
        )
    )

    // Routes Clients
    .get('/api/clients', async () => {
        const [rows] = await db.query<ClientRow[]>('SELECT * FROM client')
        return rows
    })

    .get('/api/clients/:id', async ({ params: { id } }) => {
        const [rows] = await db.query<ClientRow[]>('SELECT * FROM client WHERE id_client = ?', [id])
        if (!rows[0]) throw new Error('Client not found')
        return rows[0]
    })

    .get('/api/clients/email/:email', async ({ params: { email } }) => {
        const [rows] = await db.query<ClientRow[]>('SELECT * FROM client WHERE email = ?', [email])
        if (!rows[0]) throw new Error('Client not found')
        return rows[0]
    })

    .get('/api/clients/:id/deliveries', async ({ params: { id } }) => {
        const [rows] = await db.query<DeliveryRow[]>(
            'SELECT * FROM delivery WHERE id_client = ?',
            [id]
        )
        return rows
    })

    .post('/api/clients', async ({ body }) => {
        const id = uuid()
        const { firstname, lastname, email, birthdate, is_alive, allow_criminal_record, wants_extra_napkins } = body as any

        await db.query<ResultSetHeader>(
            `INSERT INTO client (
            id_client, firstname, lastname, email, birthdate, 
            is_alive, allow_criminal_record, wants_extra_napkins
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, firstname, lastname, email, birthdate, is_alive, allow_criminal_record, wants_extra_napkins]
        )

        return { id, firstname, lastname, email }
    })

    .put('/api/clients/:id', async ({ params: { id }, body }) => {
        const { firstname, lastname, email, birthdate, is_alive, allow_criminal_record, wants_extra_napkins } = body as any

        await db.query<ResultSetHeader>(
            `UPDATE client SET
            firstname = ?, lastname = ?, email = ?, birthdate = ?,
            is_alive = ?, allow_criminal_record = ?, wants_extra_napkins = ?
            WHERE id_client = ?`,
            [firstname, lastname, email, birthdate, is_alive, allow_criminal_record, wants_extra_napkins, id]
        )

        return { id, firstname, lastname, email }
    })

    .delete('/api/clients/:id', async ({ params: { id } }) => {
        await db.query<ResultSetHeader>('DELETE FROM client WHERE id_client = ?', [id])
        return { message: 'Client deleted' }
    })





    // Routes Chauffeurs
    .get('/api/drivers', async () => {
        const [rows] = await db.query<DriverRow[]>('SELECT * FROM driver')
        return rows
    })

    .get('/api/drivers/:id', async ({ params: { id } }) => {
        const [rows] = await db.query<DriverRow[]>('SELECT * FROM driver WHERE id_driver = ?', [id])
        if (!rows[0]) throw new Error('Driver not found')
        return rows[0]
    })

    .post('/api/drivers', async ({ body }) => {
        const id = uuid()
        const {
            firstname, lastname, email, price,
            has_criminal_record, has_driving_licence,
            days_since_last_accident, description
        } = body as any

        await db.query<ResultSetHeader>(
            `INSERT INTO driver (
            id_driver, firstname, lastname, email, price,
            has_criminal_record, has_driving_licence,
            days_since_last_accident, description
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, firstname, lastname, email, price,
                has_criminal_record, has_driving_licence,
                days_since_last_accident, description]
        )

        return { id, firstname, lastname, email }
    })


    .delete('/api/drivers/:id', async ({ params: { id } }) => {
        await db.query<ResultSetHeader>('DELETE FROM driver WHERE id_driver = ?', [id])
        return { message: 'Driver deleted' }
    })

    .get('/api/drivers/:id/deliveries', async ({ params: { id } }) => {
        const [rows] = await db.query<DeliveryRow[]>(
            `SELECT d.* FROM delivery d
         JOIN delivery_line dl ON d.id_delivery = dl.id_delivery
         WHERE dl.id_driver = ?`,
            [id]
        )
        return rows
    })



    // Routes Panier
    .get('/api/clients/:id/cart', async ({ params: { id } }) => {
        const [rows] = await db.query<DriverRow[]>(
            `SELECT d.* FROM driver d
         JOIN cart_line cl ON d.id_driver = cl.id_driver
         WHERE cl.id_client = ?`,
            [id]
        )
        return rows
    })

    .post('/api/clients/:id/cart/:driver_id', async ({ params: { id, driver_id } }) => {
        await db.query<ResultSetHeader>(
            'INSERT INTO cart_line (id_client, id_driver) VALUES (?, ?)',
            [id, driver_id]
        )
        return { message: 'Driver added to cart' }
    })

    .delete('/api/clients/:id/cart/:driver_id', async ({ params: { id, driver_id } }) => {
        await db.query<ResultSetHeader>(
            'DELETE FROM cart_line WHERE id_client = ? AND id_driver = ?',
            [id, driver_id]
        )
        return { message: 'Driver removed from cart' }
    })

    // Routes Livraisons
    .get('/api/deliveries', async () => {
        const [rows] = await db.query<DeliveryRow[]>('SELECT * FROM delivery')
        return rows
    })

    .get('/api/deliveries/:id', async ({ params: { id } }) => {
        const [deliveryRows] = await db.query<DeliveryRow[]>(
            'SELECT * FROM delivery WHERE id_delivery = ?',
            [id]
        )

        const [driverRows] = await db.query<DriverRow[]>(
            `SELECT d.* FROM driver d
         JOIN delivery_line dl ON d.id_driver = dl.id_driver
         WHERE dl.id_delivery = ?`,
            [id]
        )

        if (!deliveryRows[0]) throw new Error('Delivery not found')

        return {
            ...deliveryRows[0],
            drivers: driverRows
        }
    })

    .get('/api/deliveries/:id/lines', async ({ params: { id } }) => {
        const [rows] = await db.query<DriverRow[]>(
            `SELECT d.*, dl.id_delivery 
         FROM driver d
         JOIN delivery_line dl ON d.id_driver = dl.id_driver
         WHERE dl.id_delivery = ?`,
            [id]
        )

        if (!rows.length) {
            throw new Error('No delivery lines found for this delivery')
        }

        return rows
    })

/*
    .post('/api/deliveries', async ({ body }) => {
        const id = uuid()
        const { delivery_date, drivers, id_client } = body as any

        // Calculer le prix total basé sur les chauffeurs sélectionnés
        const [driverPrices] = await db.query<PriceSum[]>(
            'SELECT SUM(price) as total FROM driver WHERE id_driver IN (?)',
            [drivers]
        )
        const total_price = driverPrices[0].total

        // Créer la livraison
        await db.query<ResultSetHeader>(
            `INSERT INTO delivery (
            id_delivery, delivery_date, total_price,
            state, id_client
        ) VALUES (?, ?, ?, 'pending', ?)`,
            [id, delivery_date, total_price, id_client]
        )

        // Ajouter les lignes de livraison
        for (const driverId of drivers) {
            await db.query<ResultSetHeader>(
                'INSERT INTO delivery_line (id_driver, id_delivery) VALUES (?, ?)',
                [driverId, id]
            )
        }

        return { id, delivery_date, total_price, state: 'pending' }
    })
*/



    // Post delivery by using current cart
    .post('/api/deliveries', async ({ body }) => {
        const id = uuid()
        const { delivery_date, id_client } = body as any

        // Get drivers from cart
        const [cartRows] = await db.query<DriverRow[]>(
            'SELECT id_driver FROM cart_line WHERE id_client = ?',
            [id_client]
        )

        if (!cartRows.length) {
            throw new Error('No drivers in cart')
        }

        // Calculer le prix total basé sur les chauffeurs sélectionnés
        const [driverPrices] = await db.query<PriceSum[]>(
            'SELECT SUM(price) as total FROM driver WHERE id_driver IN (?)',
            [cartRows.map(row => row.id_driver)]
        )
        const total_price = driverPrices[0].total

        // Créer la livraison
        await db.query<ResultSetHeader>(
            `INSERT INTO delivery (
            id_delivery, delivery_date, total_price,
            state, id_client
        ) VALUES (?, ?, ?, 'pending', ?)`,
            [id, delivery_date, total_price, id_client]
        )

        // Ajouter les lignes de livraison
        for (const { id_driver } of cartRows) {
            await db.query<ResultSetHeader>(
                'INSERT INTO delivery_line (id_driver, id_delivery) VALUES (?, ?)',
                [id_driver, id]
            )
        }

        // Vider le panier
        await db.query<ResultSetHeader>(
            'DELETE FROM cart_line WHERE id_client = ?',
            [id_client]
        )

        return { id, delivery_date, total_price, state: 'En cours de validation' }
    })

    .put('/api/deliveries/:id/state', async ({ params: { id }, body }) => {
        const { state } = body as any

        await db.query<ResultSetHeader>(
            'UPDATE delivery SET state = ? WHERE id_delivery = ?',
            [state, id]
        )

        return { id, state }
    })

    .listen(process.env.PORT ?? 3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);