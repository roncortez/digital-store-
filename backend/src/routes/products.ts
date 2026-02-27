import { Router, Request, Response } from 'express';
import * as XLSX from 'xlsx';
import multer from "multer";
import { query } from '../database';


const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 15 * 1024 * 1024 },
});

// ============================================
// Helper Functions
// ============================================

interface Brand {
    id: number;
    name: string;
}

interface ConditionMap {
    OPEN_BOX: number | undefined;
    NEW: number | undefined;
    REFURBISHED: number | undefined;
}

/**
 * Build category map from database
 */
async function buildCategoryMap(): Promise<Map<string, number>> {
    const categoryMap = new Map<string, number>();
    const categoriesResult = await query(`SELECT id, code FROM categories`);
    
    for (const row of categoriesResult.rows) {
        categoryMap.set(row.code, row.id);
    }
    
    return categoryMap;
}

/**
 * Build brand list from database
 */
async function buildBrandList(): Promise<Brand[]> {
    const brandsResult = await query(`SELECT id, name FROM brands`);
    return brandsResult.rows.map(b => ({
        id: b.id,
        name: b.name.toUpperCase()
    }));
}

/**
 * Build condition map from database
 */
async function buildConditionMap(): Promise<ConditionMap> {
    const conditionsRes = await query(`SELECT id, name FROM conditions`);
    const conditionMap = new Map<string, number>();
    
    for (const c of conditionsRes.rows) {
        conditionMap.set((c.name).toString().toUpperCase(), c.id);
    }
    
    return {
        OPEN_BOX: conditionMap.get('OPEN BOX'),
        NEW: conditionMap.get('NUEVO'),
        REFURBISHED: conditionMap.get('REACONDICIONADO')
    };
}

/**
 * Resolve condition ID based on product name
 */
function resolveConditionId(productName: string, conditions: ConditionMap): number | undefined {
    const name = (productName ?? '').toUpperCase();

    if (name.includes('OPEN BOX') && conditions.OPEN_BOX) {
        return conditions.OPEN_BOX;
    } else if (name.includes('REFURBISHED') && conditions.REFURBISHED) {
        return conditions.REFURBISHED;
    }
    
    return conditions.NEW;
}

/**
 * Resolve brand ID based on product name
 */
function resolveBrandId(productName: string, brands: Brand[]): number | null {
    const name = (productName ?? '').toUpperCase();

    for (const brand of brands) {
        if (name.includes(brand.name)) {
            return brand.id;
        }
    }

    return null;
}

/**
 * Parse Excel file and extract categories
 */
function extractCategories(rows: any[]): { first: string; second: string }[] {
    return rows
        .slice(1)
        .filter((row: any) => {
            const first = row[0];
            if (!first) return false;
            return (first.toString().match(/:/g) || []).length === 1;
        })
        .map((row: any) => ({
            first: row[0],
            second: row[1],
        }));
}

/**
 * Parse Excel file and extract products
 */
function extractProducts(rows: any[]): { code: string; name: string; price: number; warranty: string }[] {
    return rows
        .slice(1)
        .filter((row: any) => {
            const first = row[0];
            if (!first) return false;
            return (first.toString().match(/:/g) || []).length === 2;
        })
        .map((row: any) => ({
            code: row[0],
            name: row[1],
            price: row[2],
            warranty: row[3]
        }));
}
router.get('/', async (req: Request, res: Response) => {
    try {
        const { categories, brands, conditions, search, page, limit } = req.query;

        // Pagination defaults
        const pageNum = page ? parseInt(page as string) : 1;
        const limitNum = limit ? parseInt(limit as string) : 20;
        const offset = (pageNum - 1) * limitNum;

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

        // Get total count with filters
        const countSql = `SELECT COUNT(*) as total FROM products p WHERE 1=1${sql.split('WHERE 1=1')[1].split('ORDER BY')[0]}`;
        const countResult = await query(countSql, params);
        const total = parseInt(countResult.rows[0]?.total || '0');

        // Order and paginate
        sql += ' ORDER BY p.created_at DESC';
        sql += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(limitNum, offset);

        // Execute query
        const result = await query(sql, params);

        res.json({
            success: true,
            products: result.rows,
            total: total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum)
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch products'
        });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await query(
            `SELECT  p.*, 
            b.name as brand_name, 
            c.name as category_name, 
            cond.name as condition_name 
            FROM products as p 
            INNER JOIN brands as b on p.brand_id = b.id 
            INNER JOIN categories as c on p.category_id = c.id 
            INNER JOIN conditions as cond on p.condition_id = cond.id 
            WHERE p.id = $1`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }
        res.json({
            success: true,
            product: result.rows[0]
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch product'
        });
    }
});

router.post('/import', upload.single("file"), async (req: Request, res: Response) => {
    try {
        const file = (req as any).file;

        if (!file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        // Parse Excel file
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Extract and insert categories
        const categoryData = extractCategories(rows);
        for (const item of categoryData) {
            await query(
                `INSERT INTO categories (code, name)
                 VALUES ($1, $2)
                 ON CONFLICT (code)
                 DO UPDATE SET name = EXCLUDED.name`,
                [item.first, item.second]
            );
        }

        // Extract products from Excel
        const products = extractProducts(rows);

        // Build lookup maps from database
        const categoryMap = await buildCategoryMap();
        const brands = await buildBrandList();
        const conditions = await buildConditionMap();

        // Insert/update products
        let importedCount = 0;
        let skippedCount = 0;

        for (const product of products) {
            const categoryCode = product.code.toString().split(':').slice(0, 2).join(':');
            const categoryId = categoryMap.get(categoryCode);
            
            if (!categoryId) {
                console.log('Categoría no encontrada:', { productCode: product.code, categoryCode });
                skippedCount++;
                continue;
            }

            const brandId = resolveBrandId(product.name, brands);
            const conditionId = resolveConditionId(product.name, conditions);

            if (!conditionId) {
                console.log('No hay conditionId para:', product.name);
                skippedCount++;
                continue;
            }

            await query(
                `INSERT INTO products 
                 (code, name, price, warranty, category_id, condition_id, brand_id)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 ON CONFLICT (code)
                 DO UPDATE SET
                   name = EXCLUDED.name,
                   price = EXCLUDED.price,
                   warranty = EXCLUDED.warranty,
                   category_id = EXCLUDED.category_id,
                   condition_id = EXCLUDED.condition_id,
                   brand_id = EXCLUDED.brand_id`,
                [
                    product.code,
                    product.name,
                    product.price,
                    product.warranty,
                    categoryId,
                    conditionId,
                    brandId
                ]
            );
            
            importedCount++;
        }

        res.json({
            success: true,
            message: 'Archivo importado exitosamente',
            imported: importedCount,
            skipped: skippedCount
        });

    } catch (error) {
        console.error('Error importing product:', error);
        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
});

export default router;
