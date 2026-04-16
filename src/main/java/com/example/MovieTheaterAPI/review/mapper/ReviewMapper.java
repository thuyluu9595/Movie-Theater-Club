package com.example.MovieTheaterAPI.review.mapper;

import com.example.MovieTheaterAPI.review.dto.GetReviewDTO;
import com.example.MovieTheaterAPI.review.entities.UserMovieReview;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewMapper {
    @Mapping(target = "id", source = "review.id")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "movieId", source = "movie.id")
    @Mapping(target = "title", source = "review.title")
    @Mapping(target = "comment", source = "review.comment")
    @Mapping(target = "rating", source = "review.rating")
    @Mapping(target = "createdAt", source = "review.createdAt")
    @Mapping(target = "fullName", expression = "java(userMovieReview.getUser().getFirstname() + \" \" + userMovieReview.getUser().getLastname())")
    GetReviewDTO toGetReviewDTO(UserMovieReview userMovieReview);
}