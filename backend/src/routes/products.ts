import { Router, Request, Response } from 'express';
import { query } from '../database';

const router = Router();

// GET /api/products
// Supports filtering by categories, brands, conditions, and search
router.get('/', async (req: Request, res: Response) => {
    try {
        const { categories, brands, conditions, search } = req.query;
        console.log(categories);
        console.log(brands);
        console.log(conditions);
        console.log(search);
        // Build the SQL query dynamically
        let sql = `
      SELECT 
        p.*,
        c.name as category_name,
        b.name as brand_name,
        cond.name as condition_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN conditions cond ON p.condition_id = cond.id
      WHERE 1=1
    `;

        const params: any[] = [];
        let paramIndex = 1;

        // Filter by categories
        if (categories && typeof categories === 'string') {
            const categoryIds = categories.split(',').map(Number).filter(n => !isNaN(n));
            if (categoryIds.length > 0) {
                sql += ` AND p.category_id = ANY($${paramIndex})`;
                params.push(categoryIds);
                paramIndex++;
            }
        }

        // Filter by brands
        if (brands && typeof brands === 'string') {
            const brandIds = brands.split(',').map(Number).filter(n => !isNaN(n));
            if (brandIds.length > 0) {
                sql += ` AND p.brand_id = ANY($${paramIndex})`;
                params.push(brandIds);
                paramIndex++;
            }
        }

        // Filter by conditions
        if (conditions && typeof conditions === 'string') {
            const conditionIds = conditions.split(',').map(Number).filter(n => !isNaN(n));
            if (conditionIds.length > 0) {
                sql += ` AND p.condition_id = ANY($${paramIndex})`;
                params.push(conditionIds);
                paramIndex++;
            }
        }

        // Search by name
        if (search && typeof search === 'string') {
            sql += ` AND unaccent(lower(p.description)) ILIKE unaccent(lower($${paramIndex}))`;
            params.push(`%${search}%`);
            paramIndex++;
        }

        // Order by created_at descending (newest first)
        sql += ' ORDER BY p.created_at DESC';

        // Execute query
        const result = await query(sql, params);

        res.json({
            success: true,
            products: result.rows,
            total: result.rowCount || 0
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch products'
        });
    }
});

export default router;
