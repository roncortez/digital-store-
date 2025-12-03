import { Router, Request, Response } from 'express';
import { query } from '../database';

const router = Router();

// GET /api/categories
router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM categories ORDER BY name ASC');

        res.json({
            success: true,
            categories: result.rows
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch categories'
        });
    }
});

export default router;
