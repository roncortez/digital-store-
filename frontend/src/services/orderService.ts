import { api } from "../api/api"

export const createOrder = async (orderData: any) => {
    const response = await api.post('/orders', orderData);
    console.log(response.data);
    return response.data;
}