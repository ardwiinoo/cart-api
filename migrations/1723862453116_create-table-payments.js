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
    pgm.createTable('payments', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        order_id: {
            type: 'VARCHAR(50)',
            notNull: true
        },
        payment_method: {
            type: 'TEXT',
            notNull: true
        },
        status: {
            type: 'TEXT',
            notNull: true
        },
        amount: {
            type: 'INTEGER',
            notNull: true
        },
        transaction_id: {
            type: 'TEXT',
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
        'payments',
        'unique_order_id',
        'UNIQUE(order_id)'
    )

    pgm.addConstraint(
        'payments',
        'fk_payments.order_id_orders.id',
        'FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE'
    )    
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('payments')
};
