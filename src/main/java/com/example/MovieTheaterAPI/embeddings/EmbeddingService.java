package com.example.MovieTheaterAPI.embeddings;

import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.embedding.EmbeddingResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class EmbeddingService {

    private final EmbeddingModel embeddingModel;

    public EmbeddingService(@Qualifier("openAiEmbeddingModel") EmbeddingModel embeddingModel) {
        this.embeddingModel = embeddingModel;
    }

    /**
     * Generates an embedding for the given text and returns it as a float array.
     */
    public float[] getEmbedding(String message) {
        EmbeddingResponse response = this.embeddingModel.embedForResponse(List.of(message));
        return response.getResult().getOutput();
    }
}
