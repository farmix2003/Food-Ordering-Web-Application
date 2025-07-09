package backend.com.eatease.controller;

import backend.com.eatease.entity.Cart;
import backend.com.eatease.entity.CartItem;
import backend.com.eatease.request.CartItemReq;
import backend.com.eatease.response.CartResponse;
import backend.com.eatease.response.MessageResponse;
import backend.com.eatease.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/public/add")
    public ResponseEntity<CartItem> addToCart(@RequestHeader("Authorization")String jwt,
                                              @RequestBody CartItemReq req
                                              ) throws Exception {
        CartItem cartItem = cartService.addItemToCart(req, jwt);
        return new ResponseEntity<>(cartItem, HttpStatus.CREATED);
    }


    @PutMapping("/public/update/{id}")
    public ResponseEntity<CartItem> updateCartItem(@PathVariable Long id,
                                                   @RequestParam int quantity,
                                                   @RequestHeader("Authorization")String jwt
                                                   ) throws Exception {
        CartItem updatedCartItem = cartService.updateCartItem(id, quantity);
        return ResponseEntity.ok().body(updatedCartItem);
    }

    @DeleteMapping("/public/delete/{id}")
    public ResponseEntity<MessageResponse> deleteCartItemFromCart(@PathVariable Long id,
                                                                  @RequestHeader("Authorization") String jwt
                                                                  ) throws Exception {
        cartService.removeCartItem(id, jwt);
        MessageResponse msg = new MessageResponse();
        msg.setMessage("Cart item removed successfully");
        return ResponseEntity.ok(msg);
    }

    @GetMapping("/public/user-cart/{id}")
    public ResponseEntity<CartResponse> getUserCart(@PathVariable Long id,
                                                    @RequestHeader("Authorization") String jwt
                                            ) throws Exception {
        CartResponse cartResponse = cartService.getCartResponseByUserId(id);
        return ResponseEntity.ok(cartResponse);
    }

    @DeleteMapping("/public/clear/{id}")
    public ResponseEntity<?> clearCart(@PathVariable Long id,
                                       @RequestHeader("Authorization") String jwt
                                       ) throws Exception {
        cartService.clearCart(id);
        return ResponseEntity.ok("Cart cleared");
    }
}
