package com.example.channelpartner.controller;

import com.example.channelpartner.dto.BookingDTO;
import com.example.channelpartner.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    public ResponseEntity<Page<BookingDTO>> getAllBookings(Pageable pageable) {
        return ResponseEntity.ok(bookingService.getAllBookings(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<BookingDTO>> getBookingsByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(bookingService.getBookingsByCustomerId(customerId));
    }

    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(@RequestBody BookingDTO bookingDTO) {
        return ResponseEntity.ok(bookingService.createBooking(bookingDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookingDTO> updateBooking(@PathVariable Long id, @RequestBody BookingDTO bookingDTO) {
        return ResponseEntity.ok(bookingService.updateBooking(id, bookingDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getBookingStats() {
        return ResponseEntity.ok(Map.of(
                "totalBookings", bookingService.getTotalBookings(),
                "booked", bookingService.getBookedCount(),
                "confirmed", bookingService.getConfirmedCount()
        ));
    }
}
