package com.example.channelpartner.controller;

import com.example.channelpartner.dto.FollowUpDTO;
import com.example.channelpartner.service.FollowUpService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/followups")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FollowUpController {

    private final FollowUpService followUpService;

    @GetMapping
    public ResponseEntity<List<FollowUpDTO>> getAllFollowUps() {
        return ResponseEntity.ok(followUpService.getAllFollowUps());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FollowUpDTO> getFollowUpById(@PathVariable Long id) {
        return ResponseEntity.ok(followUpService.getFollowUpById(id));
    }

    @PostMapping
    public ResponseEntity<FollowUpDTO> createFollowUp(@RequestBody FollowUpDTO followUpDTO) {
        return ResponseEntity.ok(followUpService.createFollowUp(followUpDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FollowUpDTO> updateFollowUp(@PathVariable Long id, @RequestBody FollowUpDTO followUpDTO) {
        return ResponseEntity.ok(followUpService.updateFollowUp(id, followUpDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFollowUp(@PathVariable Long id) {
        followUpService.deleteFollowUp(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/current-week")
    public ResponseEntity<List<FollowUpDTO>> getCurrentWeekFollowUps() {
        return ResponseEntity.ok(followUpService.getCurrentWeekFollowUps());
    }
}
