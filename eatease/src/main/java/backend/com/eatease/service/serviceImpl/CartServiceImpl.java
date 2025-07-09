package backend.com.eatease.service.serviceImpl;

import backend.com.eatease.dto.ExtrasDto;
import backend.com.eatease.entity.*;
import backend.com.eatease.repository.CartItemRepository;
import backend.com.eatease.repository.CartRepository;
import backend.com.eatease.repository.ExtrasRepository;
import backend.com.eatease.request.CartItemReq;
import backend.com.eatease.response.CartItemResponse;
import backend.com.eatease.response.CartResponse;
import backend.com.eatease.response.ImageResponse;
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


    private void updateCartTotal(Cart cart) {
        long total = 0L;
        for (CartItem item : cart.getCartItems()) {
            total += (long) item.getTotalPrice();
        }
        cart.setTotal(total);
        cartRepository.save(cart);
    }

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
        double totalPrice = (menu.getPrice() + extrasTotal) * cartItem.getQuantity();

        newCartItem.setQuantity(cartItem.getQuantity());
        newCartItem.setTotalPrice(totalPrice);

        cart.getCartItems().add(newCartItem);
        updateCartTotal(cart);

        return newCartItem;
    }

    @Override
    @Transactional
    public CartItem updateCartItem(Long cartItemId, int quantity) throws Exception {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("Cart item not found"));

        double extrasTotal = item.getExtras().stream().mapToDouble(Extras::getPrice).sum();
        item.setQuantity(quantity);
        item.setTotalPrice((item.getFood().getPrice() + extrasTotal) * quantity);

        cartItemRepository.save(item);
        updateCartTotal(item.getCart());

        return item;
    }

    @Override
    @Transactional
    public void removeCartItem(Long cartItemId, String jwt) throws Exception {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("Cart item not found"));

        Cart cart = item.getCart();
        cart.getCartItems().remove(item);
        cartItemRepository.delete(item);
        updateCartTotal(cart);
    }

    @Override
    public Long calculateCartTotal(Cart cart) throws Exception {
        if (cart == null || cart.getCartItems().isEmpty()) {
            return 0L;
        }
        return cart.getCartItems().stream()
                .mapToLong(item -> (long) item.getTotalPrice())
                .sum();
    }

    @Override
    public Cart findCartById(Long cartId) throws Exception {
        return cartRepository.findById(cartId)
                .orElseThrow(() -> new EntityNotFoundException("Cart not found"));
    }

    @Override
    public Cart findCartByUserId(Long userId) throws Exception {
        return cartRepository.findByCustomerId(userId);
    }

    @Override
    public void clearCart(Long userId) throws Exception {
        Cart cart = cartRepository.findByCustomerId(userId);
        cart.getCartItems().clear();
        cart.setTotal(0L);
        cartRepository.save(cart);
    }

    @Override
    public CartResponse getCartResponseByUserId(Long id) {
        Cart cart = cartRepository.findByCustomerId(id);

        CartResponse cartResponse = new CartResponse();
        cartResponse.setCartId(cart.getId());
        cartResponse.setTotal(cart.getTotal());

        List<CartItemResponse> itemResponses = cart.getCartItems().stream()
                .map(item -> {
                    CartItemResponse res = new CartItemResponse();
                    res.setId(item.getId());
                    res.setFoodName(item.getFood().getFoodName());
                    res.setQuantity(item.getQuantity());
                    res.setPricePerUnit(item.getFood().getPrice());
                    res.setTotalPrice(item.getTotalPrice());

                    if (!item.getFood().getImagesList().isEmpty()) {
                       List<ImageResponse> imageResponses =  item.getFood().getImagesList().stream()
                                .map(file ->{
                                    ImageResponse img = new ImageResponse();
                                    img.setId(file.getId());
                                    img.setUrl("http://localhost:8080/api/public/images/" + file.getId());
                                    img.setFileName(file.getFileName());
                                    return img;
                                }).toList();
                       res.setImage(imageResponses.getFirst());
                    }

                    List<ExtrasDto> extras = item.getExtras().stream()
                            .map(e -> new ExtrasDto(e.getId(), e.getName(), e.getPrice()))
                            .toList();
                    res.setExtras(extras);
                    return res;
                }).toList();

        cartResponse.setItems(itemResponses);
        return cartResponse;
    }
}
