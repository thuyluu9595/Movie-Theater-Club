package com.example.MovieTheaterAPI;

import com.example.MovieTheaterAPI.movie.s3.S3Service;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.net.URL;

@SpringBootApplication
public class MovieTheaterApiApplication {
	public static void main(String[] args) {
		SpringApplication.run(MovieTheaterApiApplication.class, args);
	}

	@Bean
	CommandLineRunner runner(S3Service s3Service) {
		return args -> {
			URL url = s3Service.PutObject("project-cmpe202", "foo", "Hello World!".getBytes());
			System.out.println(url);
		};
	}

}
