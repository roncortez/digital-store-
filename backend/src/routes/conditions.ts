import { Router, Request, Response } from 'express';
import { query } from '../database';

const router = Router();

// GET /api/conditions
router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM conditions ORDER BY name ASC');

        res.json({
            success: true,
            conditions: result.rows
        });
    } catch (error) {
        console.error('Error fetching conditions:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch conditions'
        });
    }
});

export default router;
