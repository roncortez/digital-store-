import { Router, Request, Response } from 'express';
import { query } from '../database';

const router = Router();

type UserLevel = 'Oro' | 'Plata' | 'Bronce';

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await query('SELECT * FROM users WHERE firebase_uid = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            })
        }

        function levelFromPoints(points: number): UserLevel {
            if (points >= 2000) return 'Oro';
            if (points >= 1000) return 'Plata';
            return 'Bronce';
        }

        result.rows[0].level = levelFromPoints(result.rows[0].points);
        console.log(result.rows[0]);

        res.json({
            success: true,
            user: result.rows[0]
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user'
        })
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const { firebase_uid, first_name, last_name, email, phone, address, doc_id } = req.body;
        const result = await query(
            `INSERT INTO users (firebase_uid, first_name, last_name, email, phone, address, doc_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [firebase_uid, first_name, last_name, email, phone, address, doc_id]
        )
        res.status(201).json({
            success: true,
            user: result.rows[0]
        });
        console.log(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to create user'
        })
    }
});


router.put('/:id', async (req: Request, res: Response) => {
    try {
        console.log(req.params);
        console.log(req.body);
        const { id: firebase_uid } = req.params;
        const { first_name, last_name, doc_id, phone, address } = req.body;

        const result = await query(
            `UPDATE users 
            SET first_name = $1, 
            last_name = $2, 
            doc_id = $3, 
            phone = $4,
            address = $5,
            updated_at = NOW() 
            WHERE firebase_uid = $6
            RETURNING *`, [first_name, last_name, doc_id, phone, address, firebase_uid]
        );

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            })
        }

        res.json({
            success: true,
            message: 'Test exitoso',
            user: result.rows[0]
        })
    } catch (error) {

    }
})
export default router;