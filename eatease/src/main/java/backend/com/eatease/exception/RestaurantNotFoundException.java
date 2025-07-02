package backend.com.eatease.exception;

public class RestaurantNotFoundException extends Exception {
    public RestaurantNotFoundException(String s) {
        super(s);
    }
}
