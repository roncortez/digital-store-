// User-related type definitions
export type UserLevel = 'Oro' | 'Plata' | 'Bronce';

export interface User {
    firebase_uid: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    address: string | null;
    created_at: string;
    updated_at: string;
    level: UserLevel;
    points?: number;
    doc_id?: string | null;
}

export interface UserFormData {
    first_name: string;
    last_name: string;
    doc_id: string;
    phone: string;
    address: string;
}
