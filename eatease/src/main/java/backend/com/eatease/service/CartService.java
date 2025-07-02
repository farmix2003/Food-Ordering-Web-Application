package backend.com.eatease.service;

import backend.com.eatease.entity.Cart;
import backend.com.eatease.entity.CartItem;
import backend.com.eatease.request.CartItemReq;

public interface CartService {
    CartItem addItemToCart(CartItemReq cartItem, String jwt) throws Exception;
    CartItem updateCartItem(Long cartItemId, int quantity) throws Exception;
    void removeCartItem(Long cartItemId, String jwt) throws Exception;
    Long calculateCartTotal(Cart cart) throws Exception;
    Cart findCartById(Long cartId) throws Exception;
    Cart findCartByUserId(Long userId) throws Exception;
    Cart clearCart(Long userId) throws Exception;
}
