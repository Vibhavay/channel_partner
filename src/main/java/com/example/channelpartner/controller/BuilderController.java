package com.example.channelpartner.controller;

import com.example.channelpartner.dto.BuilderDTO;
import com.example.channelpartner.service.BuilderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/builders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BuilderController {

    private final BuilderService builderService;

    @GetMapping
    public ResponseEntity<Page<BuilderDTO>> getAllBuilders(Pageable pageable) {
        return ResponseEntity.ok(builderService.getAllBuilders(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BuilderDTO> getBuilderById(@PathVariable Long id) {
        return ResponseEntity.ok(builderService.getBuilderById(id));
    }

    @PostMapping
    public ResponseEntity<BuilderDTO> createBuilder(@RequestBody BuilderDTO builderDTO) {
        return ResponseEntity.ok(builderService.createBuilder(builderDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BuilderDTO> updateBuilder(@PathVariable Long id, @RequestBody BuilderDTO builderDTO) {
        return ResponseEntity.ok(builderService.updateBuilder(id, builderDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBuilder(@PathVariable Long id) {
        builderService.deleteBuilder(id);
        return ResponseEntity.noContent().build();
    }
}
