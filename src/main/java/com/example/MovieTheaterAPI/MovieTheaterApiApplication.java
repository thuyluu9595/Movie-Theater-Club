package com.example.MovieTheaterAPI;

import com.example.MovieTheaterAPI.movie.s3.S3Service;
import com.example.MovieTheaterAPI.movie.service.MovieService;
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

}
