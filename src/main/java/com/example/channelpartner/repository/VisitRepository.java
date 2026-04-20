package com.example.channelpartner.repository;

import com.example.channelpartner.model.Visit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface VisitRepository extends JpaRepository<Visit, Long> {
    @Query("SELECT COUNT(v) FROM Visit v WHERE v.visitStatus = 'confirmed'")
    long countConfirmedVisits();
}
