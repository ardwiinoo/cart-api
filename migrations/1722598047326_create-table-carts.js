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
    pgm.createTable('carts', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true
        }
    })

    pgm.addConstraint(
        'carts',
        'unique_user_id',
        'UNIQUE(user_id)'
    )

    pgm.addConstraint(
        'carts',
        'fk_carts.user_id_users.id',
        'FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE'
    )
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('carts')
};
