package com.example.channelpartner.service;

import com.example.channelpartner.dto.BuilderDTO;
import com.example.channelpartner.model.Builder;
import com.example.channelpartner.repository.BuilderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BuilderService {

    private final BuilderRepository builderRepository;

    public Page<BuilderDTO> getAllBuilders(Pageable pageable) {
        return builderRepository.findAll(pageable).map(this::convertToDTO);
    }

    public BuilderDTO getBuilderById(Long id) {
        Builder builder = builderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Builder not found"));
        return convertToDTO(builder);
    }

    public BuilderDTO createBuilder(BuilderDTO builderDTO) {
        Builder builder = convertToEntity(builderDTO);
        Builder savedBuilder = builderRepository.save(builder);
        return convertToDTO(savedBuilder);
    }

    public BuilderDTO updateBuilder(Long id, BuilderDTO builderDTO) {
        Builder builder = builderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Builder not found"));
        builder.setFirstName(builderDTO.getFirstName());
        builder.setLastName(builderDTO.getLastName());
        builder.setEmail(builderDTO.getEmail());
        builder.setContactNumber(builderDTO.getContactNumber());
        builder.setAddress(builderDTO.getAddress());
        builder.setCity(builderDTO.getCity());
        builder.setState(builderDTO.getState());
        builder.setOffice(builderDTO.getOffice());
        builder.setPin(builderDTO.getPin());
        builder.setGstNo(builderDTO.getGstNo());
        Builder updatedBuilder = builderRepository.save(builder);
        return convertToDTO(updatedBuilder);
    }

    public void deleteBuilder(Long id) {
        builderRepository.deleteById(id);
    }

    private BuilderDTO convertToDTO(Builder builder) {
        BuilderDTO dto = new BuilderDTO();
        dto.setId(builder.getId());
        dto.setFirstName(builder.getFirstName());
        dto.setLastName(builder.getLastName());
        dto.setEmail(builder.getEmail());
        dto.setContactNumber(builder.getContactNumber());
        dto.setAddress(builder.getAddress());
        dto.setCity(builder.getCity());
        dto.setState(builder.getState());
        dto.setOffice(builder.getOffice());
        dto.setPin(builder.getPin());
        dto.setGstNo(builder.getGstNo());
        return dto;
    }

    private Builder convertToEntity(BuilderDTO dto) {
        Builder builder = new Builder();
        builder.setFirstName(dto.getFirstName());
        builder.setLastName(dto.getLastName());
        builder.setEmail(dto.getEmail());
        builder.setContactNumber(dto.getContactNumber());
        builder.setAddress(dto.getAddress());
        builder.setCity(dto.getCity());
        builder.setState(dto.getState());
        builder.setOffice(dto.getOffice());
        builder.setPin(dto.getPin());
        builder.setGstNo(dto.getGstNo());
        return builder;
    }
}
