package backend.com.eatease.exception;

import backend.com.eatease.response.AuthResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<AuthResponse> handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
        AuthResponse response = new AuthResponse();
        response.setMessage(ex.getMessage());
        response.setJwt(null);
        response.setRole(null);
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<AuthResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        AuthResponse response = new AuthResponse();
        response.setMessage(ex.getMessage());
        response.setJwt(null);
        response.setRole(null);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<AuthResponse> handleGenericException(Exception ex) {
        AuthResponse response = new AuthResponse();
        response.setMessage("An unexpected error occurred");
        response.setJwt(null);
        response.setRole(null);
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
