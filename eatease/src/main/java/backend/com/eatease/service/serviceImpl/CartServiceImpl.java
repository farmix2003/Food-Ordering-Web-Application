package backend.com.eatease.service.serviceImpl;

import backend.com.eatease.entity.*;
import backend.com.eatease.repository.CartItemRepository;
import backend.com.eatease.repository.CartRepository;
import backend.com.eatease.repository.ExtrasRepository;
import backend.com.eatease.request.CartItemReq;
import backend.com.eatease.service.CartService;
import backend.com.eatease.service.MenuService;
import backend.com.eatease.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartServiceImpl implements CartService {


    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private MenuService menuService;

    @Autowired
    private ExtrasRepository extrasRepository;

    @Override
    @Transactional
    public CartItem addItemToCart(CartItemReq cartItem, String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Cart cart = cartRepository.findByCustomerId(user.getId());

        Menu menu = menuService.getFoodById(cartItem.getFoodId());

        List<Extras> extras = extrasRepository.findAllById(cartItem.getExtrasIds());

        CartItem newCartItem = new CartItem();
        newCartItem.setFood(menu);
        newCartItem.setCart(cart);
        newCartItem.setExtras(extras);

        double extrasTotal = extras.stream().mapToDouble(Extras::getPrice).sum();
        double totalPrice = (menu.getPrice()+extrasTotal)*cartItem.getQuantity();

        newCartItem.setQuantity(cartItem.getQuantity());
        newCartItem.setTotalPrice(totalPrice);

        cart.getCartItems().add(newCartItem);
        cartRepository.save(cart);

        return newCartItem;
    }

    @Override
    @Transactional
    public CartItem updateCartItem(Long cartItemId, int quantity) throws Exception {

        CartItem item = cartItemRepository.findById(cartItemId).orElseThrow();

        double extrasTotal = item.getExtras().stream().mapToDouble(Extras::getPrice).sum();

        item.setQuantity(quantity);
        item.setTotalPrice((item.getFood().getPrice()+extrasTotal)*quantity);
        cartItemRepository.save(item);

        return item;
    }

    @Override
    public void removeCartItem(Long cartItemId, String jwt) throws Exception {
        cartItemRepository.deleteById(cartItemId);
    }

    @Override
    public Long calculateCartTotal(Cart cart) throws Exception {
        if (cart == null || cart.getCartItems().isEmpty()) {
            return 0L;
        }


        return cart.getCartItems().stream()
                .mapToLong(item -> (long) (item.getFood().getPrice() * item.getQuantity()))
                .sum();
    }

    @Override
    public Cart findCartById(Long cartId) throws Exception {
        return cartRepository.findById(cartId).orElseThrow(() -> new EntityNotFoundException("Cart bot found"));
    }

    @Override
    public Cart findCartByUserId(Long userId) throws Exception {
        return cartRepository.findByCustomerId(userId);
    }

    @Override
    public Cart clearCart(Long userId) throws Exception {
        Cart cart = cartRepository.findByCustomerId(userId);
        cart.getCartItems().clear();
        return cartRepository.save(cart);
    }
}
