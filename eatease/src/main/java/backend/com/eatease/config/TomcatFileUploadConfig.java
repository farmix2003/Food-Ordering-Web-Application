package backend.com.eatease.config;

import jakarta.servlet.MultipartConfigElement;
import org.apache.catalina.connector.Connector;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TomcatFileUploadConfig implements WebServerFactoryCustomizer<TomcatServletWebServerFactory> {
    @Override
    public void customize(TomcatServletWebServerFactory factory) {
        factory.addConnectorCustomizers((Connector connector) -> {
            connector.setProperty("maxFileCount", "10"); // allow up to 10 files per upload
        });
    }

    @Bean
    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> tomcatCustomizer() {
        return factory -> factory.addContextCustomizers(context -> {
            context.setAllowCasualMultipartParsing(true); // optional
//            context.senew MultipartConfigElement("", 20971520, 20971520, 512000));
        });
    }

}
