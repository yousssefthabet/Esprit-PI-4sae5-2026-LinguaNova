package com.linguanova.courss_service.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Ensures {@code courses.image} and {@code courses.description} are LONGTEXT so base64 thumbnails
 * and long text don't cause "Data too long for column" errors. Runs once at startup after the
 * datasource is ready.
 */
@Component
@Order(100)
public class DatabaseSchemaFixRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSchemaFixRunner.class);

    private final JdbcTemplate jdbcTemplate;

    public DatabaseSchemaFixRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        ensureTableExists();
        alterColumnToLongText("image");
        alterColumnToLongText("description");
    }

    private void ensureTableExists() {
        try {
            jdbcTemplate.queryForObject(
                "SELECT 1 FROM courses LIMIT 1",
                Integer.class
            );
        } catch (Exception e) {
            log.info("courses table not yet created or not accessible; schema fix will be applied when table exists: {}", e.getMessage());
        }
    }

    private void alterColumnToLongText(String columnName) {
        try {
            String checkSql = "SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'courses' AND COLUMN_NAME = ?";
            String currentType = null;
            try {
                currentType = jdbcTemplate.queryForObject(checkSql, String.class, columnName);
            } catch (Exception ignored) {
                // column or table might not exist yet
            }
            if (currentType != null && ("longtext".equalsIgnoreCase(currentType))) {
                log.info("courses.{} already LONGTEXT, skipping", columnName);
                return;
            }
            String sql = "ALTER TABLE courses MODIFY COLUMN " + columnName + " LONGTEXT NULL";
            jdbcTemplate.execute(sql);
            log.info("courses.{} column set to LONGTEXT", columnName);
        } catch (Exception e) {
            log.error("Failed to set courses.{} to LONGTEXT. Base64 thumbnails may cause 'Data too long' errors. Fix manually: ALTER TABLE courses MODIFY COLUMN " + columnName + " LONGTEXT NULL; Error: {}", columnName, e.getMessage());
            if (log.isDebugEnabled()) {
                log.debug("Full exception", e);
            }
        }
    }
}
