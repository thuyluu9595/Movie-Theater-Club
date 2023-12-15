package com.example.MovieTheaterAPI.movie.s3;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;

import java.net.URI;

@Configuration
public class S3Config {

    @Value("${aws.s3.bucket.region}")
    private String awsRegion;

//    @Value("${aws.accessKeyId}")
//    private String accessKeyId;
//
//    @Value("${aws.secretKey}")
//    private String secretKey;

    @Bean
    public S3Client s3Client() {
        S3Client client = S3Client.builder()
                .region(Region.of(awsRegion))
//                .credentialsProvider(() -> AwsBasicCredentials.create(accessKeyId, secretKey))
                .build();

        return client;
    }
}
