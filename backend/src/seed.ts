import pool, { query } from './database';
import fs from 'fs';
import path from 'path';

async function runSchema() {
    console.log('📝 Running schema.sql...');
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await query(schemaSQL);
    console.log('✅ Schema created successfully');
}

async function seedCategories() {
    console.log('📦 Seeding categories...');
    const categories = [
        'Computadoras',
        'Laptops',
        'Celulares',
        'Tablets',
        'Accesorios',
        'Monitores',
        'Teclados',
        'Mouse',
        'Audífonos',
        'Cámaras'
    ];

    for (const name of categories) {
        await query('INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [name]);
    }
    console.log(`✅ Inserted ${categories.length} categories`);
}

async function seedBrands() {
    console.log('🏷️  Seeding brands...');
    const brands = [
        'Apple',
        'Samsung',
        'Xiaomi',
        'Huawei',
        'OnePlus',
        'OPPO',
        'Vivo',
        'Realme',
        'Motorola',
        'LG',
        'Dell',
        'HP',
        'Lenovo',
        'Asus',
        'Acer',
        'MSI',
        'Razer',
        'Logitech',
        'Sony',
        'Canon'
    ];

    for (const name of brands) {
        await query('INSERT INTO brands (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [name]);
    }
    console.log(`✅ Inserted ${brands.length} brands`);
}

async function seedConditions() {
    console.log('📋 Seeding conditions...');
    const conditions = [
        'Nuevo',
        'Open Box',
        'Usado - Como Nuevo',
        'Usado - Buen Estado',
        'Reacondicionado'
    ];

    for (const name of conditions) {
        await query('INSERT INTO conditions (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [name]);
    }
    console.log(`✅ Inserted ${conditions.length} conditions`);
}

async function seedProducts() {
    console.log('🛍️  Seeding products...');

    const products = [
        // Celulares
        { name: 'iPhone 14 Pro Max', description: 'Smartphone Apple con pantalla de 6.7 pulgadas', price: 1199.99, category: 'Celulares', brand: 'Apple', condition: 'Nuevo', stock: 15 },
        { name: 'Samsung Galaxy S23 Ultra', description: 'Flagship Samsung con S Pen integrado', price: 1099.99, category: 'Celulares', brand: 'Samsung', condition: 'Nuevo', stock: 20 },
        { name: 'Xiaomi 13 Pro', description: 'Smartphone premium con cámara Leica', price: 899.99, category: 'Celulares', brand: 'Xiaomi', condition: 'Nuevo', stock: 12 },
        { name: 'iPhone 13', description: 'iPhone del año anterior en excelente estado', price: 699.99, category: 'Celulares', brand: 'Apple', condition: 'Usado - Como Nuevo', stock: 8 },
        { name: 'OnePlus 11', description: 'Flagship killer con carga rápida', price: 749.99, category: 'Celulares', brand: 'OnePlus', condition: 'Nuevo', stock: 10 },

        // Laptops
        { name: 'MacBook Pro 14" M2', description: 'Laptop profesional Apple con chip M2', price: 1999.99, category: 'Laptops', brand: 'Apple', condition: 'Nuevo', stock: 5 },
        { name: 'Dell XPS 15', description: 'Laptop premium para creadores de contenido', price: 1599.99, category: 'Laptops', brand: 'Dell', condition: 'Nuevo', stock: 7 },
        { name: 'Lenovo ThinkPad X1 Carbon', description: 'Laptop empresarial ultraligera', price: 1399.99, category: 'Laptops', brand: 'Lenovo', condition: 'Nuevo', stock: 6 },
        { name: 'HP Pavilion Gaming', description: 'Laptop gaming económica', price: 899.99, category: 'Laptops', brand: 'HP', condition: 'Open Box', stock: 4 },
        { name: 'Asus ROG Zephyrus G14', description: 'Laptop gaming compacta y potente', price: 1499.99, category: 'Laptops', brand: 'Asus', condition: 'Nuevo', stock: 3 },

        // Tablets
        { name: 'iPad Pro 12.9"', description: 'Tablet profesional con chip M2', price: 1099.99, category: 'Tablets', brand: 'Apple', condition: 'Nuevo', stock: 8 },
        { name: 'Samsung Galaxy Tab S8+', description: 'Tablet Android premium', price: 799.99, category: 'Tablets', brand: 'Samsung', condition: 'Nuevo', stock: 10 },
        { name: 'iPad Air', description: 'Tablet versátil de Apple', price: 599.99, category: 'Tablets', brand: 'Apple', condition: 'Usado - Buen Estado', stock: 5 },

        // Accesorios
        { name: 'AirPods Pro 2', description: 'Audífonos inalámbricos con cancelación de ruido', price: 249.99, category: 'Audífonos', brand: 'Apple', condition: 'Nuevo', stock: 25 },
        { name: 'Sony WH-1000XM5', description: 'Audífonos over-ear con mejor cancelación de ruido', price: 399.99, category: 'Audífonos', brand: 'Sony', condition: 'Nuevo', stock: 15 },
        { name: 'Logitech MX Master 3S', description: 'Mouse ergonómico para productividad', price: 99.99, category: 'Mouse', brand: 'Logitech', condition: 'Nuevo', stock: 30 },
        { name: 'Logitech MX Keys', description: 'Teclado inalámbrico premium', price: 119.99, category: 'Teclados', brand: 'Logitech', condition: 'Nuevo', stock: 20 },
        { name: 'Razer BlackWidow V3', description: 'Teclado mecánico gaming', price: 139.99, category: 'Teclados', brand: 'Razer', condition: 'Open Box', stock: 8 },

        // Monitores
        { name: 'LG UltraGear 27"', description: 'Monitor gaming 144Hz QHD', price: 399.99, category: 'Monitores', brand: 'LG', condition: 'Nuevo', stock: 12 },
        { name: 'Dell UltraSharp 32"', description: 'Monitor 4K para profesionales', price: 699.99, category: 'Monitores', brand: 'Dell', condition: 'Nuevo', stock: 6 },

        // Cámaras
        { name: 'Canon EOS R6', description: 'Cámara mirrorless profesional', price: 2499.99, category: 'Cámaras', brand: 'Canon', condition: 'Nuevo', stock: 3 },
        { name: 'Sony A7 IV', description: 'Cámara full-frame versátil', price: 2599.99, category: 'Cámaras', brand: 'Sony', condition: 'Nuevo', stock: 2 },
    ];

    for (const product of products) {
        // Get category_id
        const categoryResult = await query('SELECT id FROM categories WHERE name = $1', [product.category]);
        const category_id = categoryResult.rows[0]?.id;

        // Get brand_id
        const brandResult = await query('SELECT id FROM brands WHERE name = $1', [product.brand]);
        const brand_id = brandResult.rows[0]?.id;

        // Get condition_id
        const conditionResult = await query('SELECT id FROM conditions WHERE name = $1', [product.condition]);
        const condition_id = conditionResult.rows[0]?.id;

        if (category_id && brand_id && condition_id) {
            await query(
                `INSERT INTO products (name, description, price, category_id, brand_id, condition_id, stock, image_url) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [
                    product.name,
                    product.description,
                    product.price,
                    category_id,
                    brand_id,
                    condition_id,
                    product.stock,
                    `https://via.placeholder.com/400x300?text=${encodeURIComponent(product.name)}`
                ]
            );
        }
    }
    console.log(`✅ Inserted ${products.length} products`);
}

async function seed() {
    try {
        console.log('🌱 Starting database seed...\n');

        await runSchema();
        await seedCategories();
        await seedBrands();
        await seedConditions();
        await seedProducts();

        console.log('\n✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Run seed if this file is executed directly
if (require.main === module) {
    seed();
}

export default seed;
