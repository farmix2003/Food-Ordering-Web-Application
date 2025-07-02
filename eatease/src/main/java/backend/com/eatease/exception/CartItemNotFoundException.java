package backend.com.eatease.exception;

public class CartItemNotFoundException extends Throwable {
    public CartItemNotFoundException(String cartIsEmpty) {
        super(cartIsEmpty);
    }
}
