package com.event.event_service.controller;

import com.event.event_service.entity.Club;
import com.event.event_service.service.ClubService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/clubs")
@RequiredArgsConstructor
public class ClubController {

    private final ClubService clubService;

    @GetMapping({"", "/"})
    public ResponseEntity<List<Club>> getAll() {
        return ResponseEntity.ok(clubService.getAll());
    }

    @PostMapping({"", "/"})
    public ResponseEntity<Club> create(@Valid @RequestBody Club payload) {
        Club created = clubService.create(payload);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Club> update(@PathVariable String id, @Valid @RequestBody Club payload) {
        return ResponseEntity.ok(clubService.update(id, payload));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        clubService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
