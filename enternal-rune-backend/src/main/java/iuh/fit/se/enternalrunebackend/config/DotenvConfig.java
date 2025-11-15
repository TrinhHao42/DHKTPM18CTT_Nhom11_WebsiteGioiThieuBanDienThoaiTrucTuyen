package iuh.fit.se.enternalrunebackend.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class DotenvConfig {

    static {
        io.github.cdimascio.dotenv.Dotenv dotenv =
                io.github.cdimascio.dotenv.Dotenv.configure()
                        .filename(".local.env") // tên file của anh
                        .ignoreIfMalformed()
                        .ignoreIfMissing()
                        .load();

        dotenv.entries().forEach(entry ->
                System.setProperty(entry.getKey(), entry.getValue())
        );
    }
}
