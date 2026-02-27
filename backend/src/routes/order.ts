import { Router, Request, Response } from 'express';
import { query } from '../database';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const orderData = req.body;
        console.log(orderData);

        const userId = await query('SELECT id FROM users where firebase_uid = $1', [orderData.user_id]);

        if (userId.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const result = await query(
            `INSERT INTO orders (
                user_id,
                order_number,
                payment_method,
                delivery_method,
                coupon_code,
                subtotal,
                discount,
                shipping_cost,
                total,
                delivery_address,
                billing_info )
            VALUES ($1, generate_order_number(), $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *`
            , [userId.rows[0].id, orderData.payment_method, orderData.delivery_method, orderData.coupon_code, orderData.subtotal, orderData.discount, orderData.shipping_cost, orderData.total, orderData.delivery_address, orderData.billing_info])
        res.json({
            success: true,
            order: result.rows[0]
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        })

    }
})

export default router;