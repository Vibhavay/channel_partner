package com.example.channelpartner.repository;

import com.example.channelpartner.model.Builder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BuilderRepository extends JpaRepository<Builder, Long> {
}
