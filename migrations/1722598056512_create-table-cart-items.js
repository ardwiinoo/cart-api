/* eslint-disable no-undef */
/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('cart_items', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        cart_id: {
            type: 'VARCHAR(50)',
            notNull: true
        },
        product_id: {
            type: 'VARCHAR(50)',
            notNull: true
        },
        quantity: {
            type: 'INTEGER',
            notNull: true
        },
        price: {
            type: 'INTEGER',
            notNull: true
        },
        created_at: {
            type: 'TIMESTAMP',
            notNull: true,
            default: pgm.func('current_timestamp')
        },
        updated_at: {
            type: 'TIMESTAMP',
            notNull: true,
            default: pgm.func('current_timestamp')
        }
    })

    pgm.addConstraint(
        'cart_items',
        'unique_cart_id_and_product_id',
        'UNIQUE(cart_id,product_id)'
    )

    pgm.addConstraint(
        'cart_items',
        'fk_cart_items.cart_id_carts.id',
        'FOREIGN KEY (cart_id) REFERENCES carts (id) ON DELETE CASCADE'
    )

    pgm.addConstraint(
        'cart_items',
        'fk_cart_items.product_id_products.id',
        'FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE'
    )
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('cart_items')
};
