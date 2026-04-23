package com.example.channelpartner.service;

import com.example.channelpartner.dto.BookingDTO;
import com.example.channelpartner.model.Booking;
import com.example.channelpartner.model.Customer;
import com.example.channelpartner.repository.BookingRepository;
import com.example.channelpartner.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;

    public Page<BookingDTO> getAllBookings(Pageable pageable) {
        return bookingRepository.findAll(pageable).map(this::convertToDTO);
    }

    public BookingDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return convertToDTO(booking);
    }

    public List<BookingDTO> getBookingsByCustomerId(Long customerId) {
        return bookingRepository.findByCustomerIdOrderByBookingDateDesc(customerId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public BookingDTO createBooking(BookingDTO bookingDTO) {
        Customer customer = customerRepository.findById(bookingDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Booking booking = convertToEntity(bookingDTO);
        booking.setCustomer(customer);
        booking.setStatus(bookingDTO.getStatus() != null ? bookingDTO.getStatus() : "Booked");

        Booking savedBooking = bookingRepository.save(booking);
        return convertToDTO(savedBooking);
    }

    public BookingDTO updateBooking(Long id, BookingDTO bookingDTO) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setProjectName(bookingDTO.getProjectName());
        booking.setBuildingName(bookingDTO.getBuildingName());
        booking.setFlatNo(bookingDTO.getFlatNo());
        booking.setFloorNo(bookingDTO.getFloorNo());
        booking.setFlatType(bookingDTO.getFlatType());
        booking.setCarpetArea(bookingDTO.getCarpetArea());
        booking.setAgreementValue(bookingDTO.getAgreementValue());
        booking.setBookingAmount(bookingDTO.getBookingAmount());
        booking.setBookingDate(bookingDTO.getBookingDate());
        booking.setPaymentPlan(bookingDTO.getPaymentPlan());
        booking.setStatus(bookingDTO.getStatus());
        booking.setSalesExecutiveId(bookingDTO.getSalesExecutiveId());
        booking.setNotes(bookingDTO.getNotes());

        Booking updatedBooking = bookingRepository.save(booking);
        return convertToDTO(updatedBooking);
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    public long getTotalBookings() {
        return bookingRepository.count();
    }

    public long getBookedCount() {
        return bookingRepository.countByStatusBooked();
    }

    public long getConfirmedCount() {
        return bookingRepository.countByStatusConfirmed();
    }

    private BookingDTO convertToDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setCustomerId(booking.getCustomer().getId());
        dto.setCustomerName(booking.getCustomer().getFirstName() + " " + booking.getCustomer().getLastName());
        dto.setCustomerEmail(booking.getCustomer().getEmail());
        dto.setCustomerPhone(booking.getCustomer().getPhone());
        dto.setProjectName(booking.getProjectName());
        dto.setBuildingName(booking.getBuildingName());
        dto.setFlatNo(booking.getFlatNo());
        dto.setFloorNo(booking.getFloorNo());
        dto.setFlatType(booking.getFlatType());
        dto.setCarpetArea(booking.getCarpetArea());
        dto.setAgreementValue(booking.getAgreementValue());
        dto.setBookingAmount(booking.getBookingAmount());
        dto.setBookingDate(booking.getBookingDate());
        dto.setPaymentPlan(booking.getPaymentPlan());
        dto.setStatus(booking.getStatus());
        dto.setSalesExecutiveId(booking.getSalesExecutiveId());
        dto.setNotes(booking.getNotes());
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setUpdatedAt(booking.getUpdatedAt());
        return dto;
    }

    private Booking convertToEntity(BookingDTO dto) {
        Booking booking = new Booking();
        booking.setProjectName(dto.getProjectName());
        booking.setBuildingName(dto.getBuildingName());
        booking.setFlatNo(dto.getFlatNo());
        booking.setFloorNo(dto.getFloorNo());
        booking.setFlatType(dto.getFlatType());
        booking.setCarpetArea(dto.getCarpetArea());
        booking.setAgreementValue(dto.getAgreementValue());
        booking.setBookingAmount(dto.getBookingAmount());
        booking.setBookingDate(dto.getBookingDate());
        booking.setPaymentPlan(dto.getPaymentPlan());
        booking.setStatus(dto.getStatus());
        booking.setSalesExecutiveId(dto.getSalesExecutiveId());
        booking.setNotes(dto.getNotes());
        return booking;
    }
}
