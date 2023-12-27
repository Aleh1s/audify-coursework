package com.aleh1s.backend.user;

import com.aleh1s.backend.dto.DtoMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;
    private final DtoMapper dtoMapper;

    @GetMapping("/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable("email") String email) {
        UserEntity user = userService.getUserByEmail(email);
        UserDto userDto = dtoMapper.toUserDto(user);
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/{email}/block")
    public ResponseEntity<?> blockUser(@PathVariable("email") String email) {
        userService.blockUserByEmail(email);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{email}/unblock")
    public ResponseEntity<?> unblockUser(@PathVariable("email") String email) {
        userService.unblockUserByEmail(email);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("{email}/password")
    public ResponseEntity<?> changePassword(
            @PathVariable("email") String email,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        userService.changePassword(email, request.password());
        return ResponseEntity.ok().build();
    }
}
