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
    pgm.createTable('users', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        email: {
            type: 'TEXT',
            notNull: true
        },
        password: {
            type: 'TEXT',
            notNull: true
        },
        avatar_url: {
            type: 'TEXT'
        },
        phone: {
            type: 'TEXT',
            notNull: true
        },
        role_id: {
            type: 'INTEGER',
            notNull: true
        },
        is_verified: {
            type: 'BOOLEAN',
            notNull: true,
            default: false
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
        'users',
        'unique_email',
        'UNIQUE(email)'
    )

    pgm.addConstraint(
        'users',
        'fk_users.role_id_roles.id',
        'FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE'
    )
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('users')
};
