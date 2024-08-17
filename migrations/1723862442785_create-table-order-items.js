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
    pgm.createTable('order_items', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        order_id: {
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
        }
    })

    pgm.addConstraint(
        'order_items',
        'unique_order_id_and_product_id',
        'UNIQUE(order_id,product_id)'
    )

    pgm.addConstraint(
        'order_items',
        'fk_order_items.order_id_orders.id',
        'FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE'
    )

     pgm.addConstraint(
        'order_items',
        'fk_order_items.product_id_products.id',
        'FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE'
    )
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('order_items')
};
