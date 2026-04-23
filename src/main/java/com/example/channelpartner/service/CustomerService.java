package com.example.channelpartner.service;

import com.example.channelpartner.dto.CustomerDTO;
import com.example.channelpartner.dto.CustomerWithLastCallDTO;
import com.example.channelpartner.model.CallLog;
import com.example.channelpartner.model.Customer;
import com.example.channelpartner.model.Project;
import com.example.channelpartner.repository.CallLogRepository;
import com.example.channelpartner.repository.CustomerRepository;
import com.example.channelpartner.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final ProjectRepository projectRepository;
    private final CallLogRepository callLogRepository;

    public Page<CustomerDTO> getAllCustomers(Pageable pageable) {
        return customerRepository.findAll(pageable).map(this::convertToDTO);
    }

    public CustomerDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        return convertToDTO(customer);
    }

    public CustomerDTO createCustomer(CustomerDTO customerDTO) {
        Project project = projectRepository.findById(customerDTO.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));
        Customer customer = convertToEntity(customerDTO);
        customer.setProject(project);
        Customer savedCustomer = customerRepository.save(customer);
        return convertToDTO(savedCustomer);
    }

    public CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        Project project = projectRepository.findById(customerDTO.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));
        customer.setFirstName(customerDTO.getFirstName());
        customer.setLastName(customerDTO.getLastName());
        customer.setEmail(customerDTO.getEmail());
        customer.setPhone(customerDTO.getPhone());
        customer.setAddress(customerDTO.getAddress());
        customer.setCity(customerDTO.getCity());
        customer.setState(customerDTO.getState());
        customer.setBudget(customerDTO.getBudget());
        customer.setStatus(customerDTO.getStatus());
        customer.setProject(project);
        Customer updatedCustomer = customerRepository.save(customer);
        return convertToDTO(updatedCustomer);
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }

    public CustomerWithLastCallDTO getCustomerWithLastCall(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        CustomerWithLastCallDTO dto = new CustomerWithLastCallDTO();
        // Set customer fields
        dto.setId(customer.getId());
        dto.setFirstName(customer.getFirstName());
        dto.setLastName(customer.getLastName());
        dto.setEmail(customer.getEmail());
        dto.setPhone(customer.getPhone());
        dto.setAddress(customer.getAddress());
        dto.setCity(customer.getCity());
        dto.setState(customer.getState());
        dto.setBudget(customer.getBudget());
        dto.setStatus(customer.getStatus());
        dto.setProjectId(customer.getProject().getId());
        dto.setProjectName(customer.getProject().getName());
        
        // Set last call fields
        CallLog lastCall = callLogRepository.findFirstByCustomerIdOrderByCallDateTimeDesc(customerId);
        if (lastCall != null) {
            dto.setLastCallId(lastCall.getId());
            dto.setLastCallDateTime(lastCall.getCallDateTime());
            dto.setLastCallType(lastCall.getCallType());
            dto.setLastCallStatus(lastCall.getCallStatus());
            dto.setLastCallNotes(lastCall.getCallNotes());
            dto.setLastCallCreatedAt(lastCall.getCreatedAt());
        }
        
        return dto;
    }

    private CustomerDTO convertToDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setFirstName(customer.getFirstName());
        dto.setLastName(customer.getLastName());
        dto.setEmail(customer.getEmail());
        dto.setPhone(customer.getPhone());
        dto.setAddress(customer.getAddress());
        dto.setCity(customer.getCity());
        dto.setState(customer.getState());
        dto.setBudget(customer.getBudget());
        dto.setStatus(customer.getStatus());
        dto.setProjectId(customer.getProject().getId());
        dto.setProjectName(customer.getProject().getName());
        return dto;
    }

    private Customer convertToEntity(CustomerDTO dto) {
        Customer customer = new Customer();
        customer.setFirstName(dto.getFirstName());
        customer.setLastName(dto.getLastName());
        customer.setEmail(dto.getEmail());
        customer.setPhone(dto.getPhone());
        customer.setAddress(dto.getAddress());
        customer.setCity(dto.getCity());
        customer.setState(dto.getState());
        customer.setBudget(dto.getBudget());
        customer.setStatus(dto.getStatus());
        return customer;
    }
}
