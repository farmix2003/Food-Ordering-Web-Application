package backend.com.eatease.exception;

public class UserAlreadyExistsException extends Throwable {
    public UserAlreadyExistsException(String s) {
        super(s);
    }
}
