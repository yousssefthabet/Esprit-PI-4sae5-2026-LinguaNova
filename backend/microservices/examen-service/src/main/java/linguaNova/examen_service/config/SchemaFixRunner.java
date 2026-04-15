package linguaNova.examen_service.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class SchemaFixRunner implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public SchemaFixRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        try {
            log.info("Vérification et nettoyage du schéma de la table note...");
            jdbcTemplate.execute("ALTER TABLE note DROP COLUMN context_id");
            log.info("Colonne context_id supprimée.");
        } catch (Exception e) {
            // Ignorer si la colonne n'existe pas
        }

        try {
            jdbcTemplate.execute("ALTER TABLE note DROP COLUMN context_type");
            log.info("Colonne context_type supprimée.");
        } catch (Exception e) {
            // Ignorer si la colonne n'existe pas
        }
    }
}
