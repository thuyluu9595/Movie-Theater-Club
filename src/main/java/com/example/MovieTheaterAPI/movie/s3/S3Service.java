package com.example.MovieTheaterAPI.movie.s3;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

import java.net.URL;

@Service
@Slf4j
public class S3Service {

    private final S3Client s3Client;

    public S3Service(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public URL PutObject(String bucketName, String key, byte[] file) {

        try {
            PutObjectRequest objectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3Client.putObject(objectRequest, RequestBody.fromBytes(file));

            GetUrlRequest request = GetUrlRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            URL url = s3Client.utilities().getUrl(request);
            return url;
        } catch (S3Exception e) {
            log.error("Error: " + e.awsErrorDetails().errorMessage());
            return null;
        } catch (SdkClientException e) {
            log.error("Error: " + e.getMessage());
    }
        return null;
    }
}
