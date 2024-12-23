export interface Client {
    id_client: string;
    firstname: string;
    lastname: string;
    email: string;
    birthdate: Date;
    is_alive: boolean;
    allow_criminal_record: boolean;
    wants_extra_napkins: boolean;
    created_at?: Date;
}

export interface Driver {
    id_driver: string;
    firstname: string;
    lastname: string;
    email: string;
    price: number;
    has_criminal_record: boolean;
    has_driving_licence: boolean;
    days_since_last_accident: number;
    description: string;
    created_at?: Date;
}

export interface Delivery {
    id_delivery: string;
    delivery_date: string;
    total_price: number;
    state: string;
    id_client: string;
    created_at?: Date;
}