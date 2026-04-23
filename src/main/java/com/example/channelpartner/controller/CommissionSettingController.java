package com.example.channelpartner.controller;

import com.example.channelpartner.dto.CommissionSettingDTO;
import com.example.channelpartner.service.CommissionSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/commission-settings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CommissionSettingController {

    private final CommissionSettingService commissionSettingService;

    @GetMapping
    public ResponseEntity<List<CommissionSettingDTO>> getAllCommissionSettings() {
        return ResponseEntity.ok(commissionSettingService.getAllCommissionSettings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommissionSettingDTO> getCommissionSettingById(@PathVariable Long id) {
        return ResponseEntity.ok(commissionSettingService.getCommissionSettingById(id));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<CommissionSettingDTO> getSettingByProject(@PathVariable Long projectId) {
        CommissionSettingDTO setting = commissionSettingService.getSettingByProject(projectId);
        return setting != null ? ResponseEntity.ok(setting) : ResponseEntity.notFound().build();
    }

    @GetMapping("/builder/{builderId}")
    public ResponseEntity<CommissionSettingDTO> getSettingByBuilder(@PathVariable Long builderId) {
        CommissionSettingDTO setting = commissionSettingService.getSettingByBuilder(builderId);
        return setting != null ? ResponseEntity.ok(setting) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<CommissionSettingDTO> createCommissionSetting(@RequestBody CommissionSettingDTO dto) {
        return ResponseEntity.ok(commissionSettingService.createCommissionSetting(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommissionSettingDTO> updateCommissionSetting(@PathVariable Long id, @RequestBody CommissionSettingDTO dto) {
        return ResponseEntity.ok(commissionSettingService.updateCommissionSetting(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommissionSetting(@PathVariable Long id) {
        commissionSettingService.deleteCommissionSetting(id);
        return ResponseEntity.noContent().build();
    }
}
