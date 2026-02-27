import { useState, useEffect } from 'react';
import { api } from '../api/api';
import { User, UserLevel } from '../types/user';

/**
 * Custom hook for fetching and managing user data
 * @param firebase_uid - The Firebase UID of the user
 * @returns User data, loading state, error state, and refetch function
 */
export const useUserData = (firebase_uid: string | undefined) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const calculateLevel = (points: number): UserLevel => {
        if (points >= 2000) return 'Oro';
        if (points >= 1000) return 'Plata';
        return 'Bronce';
    };

    const fetchUser = async () => {
        if (!firebase_uid) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await api.get(`/users/${firebase_uid}`);

            if (response.data.success) {
                const userData = response.data.user;

                // Calculate level from points
                if (userData.points !== undefined) {
                    userData.level = calculateLevel(userData.points);
                }

                setUser(userData);
            } else {
                setError('Error al cargar datos del usuario');
            }
        } catch (err) {
            console.error('Error fetching user:', err);
            setError('Error al cargar datos del usuario');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [firebase_uid]);

    return {
        user,
        loading,
        error,
        refetch: fetchUser,
        setUser,
    };
};
