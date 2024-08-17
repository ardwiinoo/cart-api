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
    pgm.createTable('orders', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true
        },
        status: {
            type: 'TEXT',
            notNull: true,
        },
        total: {
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
        'orders',
        'unique_user_id',
        'UNIQUE(user_id)'
    )

    pgm.addConstraint(
        'orders',
        'fk_orders.user_id_user.id',
        'FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE'
    )    
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('orders')
};
