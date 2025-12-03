import { Router, Request, Response } from 'express';
import { query } from '../database';

const router = Router();

// GET /api/brands
router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM brands ORDER BY name ASC');

        res.json({
            success: true,
            brands: result.rows
        });
    } catch (error) {
        console.error('Error fetching brands:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch brands'
        });
    }
});

export default router;
