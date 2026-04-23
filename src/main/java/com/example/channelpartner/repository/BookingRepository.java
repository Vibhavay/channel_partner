package com.example.channelpartner.repository;

import com.example.channelpartner.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomerId(Long customerId);

    @Query("SELECT b FROM Booking b WHERE b.customer.id = :customerId ORDER BY b.bookingDate DESC")
    List<Booking> findByCustomerIdOrderByBookingDateDesc(@Param("customerId") Long customerId);

    List<Booking> findByStatus(String status);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = 'Booked'")
    long countByStatusBooked();

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = 'Confirmed'")
    long countByStatusConfirmed();
}
