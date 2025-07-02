package backend.com.eatease.service.serviceImpl;

import backend.com.eatease.entity.*;
import backend.com.eatease.repository.*;
import backend.com.eatease.request.OrderRequest;
import backend.com.eatease.service.CartService;
import backend.com.eatease.service.OrderService;
import backend.com.eatease.service.RestaurantService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderedFoodRepository orderedFoodRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private CartService cartService;

    @Autowired
    private ExtrasRepository extrasRepository;

    @Override
    @Transactional
    public Order createOrder(OrderRequest order, User user) throws Exception {

        if (order == null || order.getShippingAddress() == null) {
            throw new IllegalArgumentException("Order request and shipping address must not be null");
        }

        Address shippingAddress = addressRepository.save(order.getShippingAddress());
        if (!user.getAddressList().contains(shippingAddress)) {
            user.getAddressList().add(shippingAddress);
            userRepository.save(user);
        }

        Restaurant restaurant = restaurantService.getRestaurantById(order.getRestaurantId());
        if (restaurant == null) {
            throw new IllegalArgumentException("Restaurant not found");
        }

        Cart cart = cartService.findCartByUserId(user.getId());

        Order newOrder = new Order();
        newOrder.setCreatedAt(new Date());
        newOrder.setOrderStatus("PENDING");
        newOrder.setRestaurant(restaurant);
        newOrder.setShippingAddress(shippingAddress);
        newOrder.setCustomer(user);
        newOrder.setTotalPrice(cartService.calculateCartTotal(cart));
        newOrder.setTotalOfOrder(cart.getCartItems().size());

        List<OrderedFood> orderedFoods = new ArrayList<>();
        for (CartItem cartItem : cart.getCartItems()) {
            OrderedFood orderedFood = new OrderedFood();
            orderedFood.setFood(cartItem.getFood());
            orderedFood.setQuantity(cartItem.getQuantity());
            orderedFood.setTotalPrice(cartItem.getTotalPrice());
            orderedFood.setOrder(newOrder);

            List<Extras> extrasList = new ArrayList<>();
            if (cartItem.getExtras() != null && !cartItem.getExtras().isEmpty()) {
                for (Extras extra : cartItem.getExtras()) {
                    Extras managedExtra = extrasRepository.findById(extra.getId())
                            .orElseThrow(() -> new IllegalArgumentException("Extras not found: " + extra.getId()));
                    extrasList.add(managedExtra);
                }
            }
            orderedFood.setExtras(extrasList);
            orderedFoods.add(orderedFood);
        }

            orderedFoodRepository.saveAll(orderedFoods);


        newOrder.setOrderedFoodList(orderedFoods);

        Order savedOrder;

            savedOrder = orderRepository.save(newOrder);

            cartService.clearCart(user.getId());


        return savedOrder;
    }
    @Override
    public Order updateOrderStatus(Long orderId, String status) throws Exception {
        Order order = getOrderById(orderId);
        if (status.equals("PENDING") || status.equals("COMPLETED") || status.equals("DELIVERED") || status.equals("ON_WAY")) {
            order.setOrderStatus(status);
            return orderRepository.save(order);
        }
        throw new Exception("Invalid status");
    }

    @Override
    public void cancelOrder(Long orderId) throws Exception {
        Order order = getOrderById(orderId);
        if (order == null) {
            throw new EntityNotFoundException("Order not found with id " + order);
        }
        order.setOrderStatus("CANCELED");
        orderRepository.save(order);
    }

    @Override
    public List<Order> getOrdersByUserId(Long userId) throws Exception {
        return orderRepository.findByCustomerId(userId);
    }

    @Override
    public Order getOrderById(Long orderId) throws Exception {
        return orderRepository.findById(orderId).orElseThrow();
    }

    @Override
    public List<Order> getRestartOrders(Long restaurantId, String status) throws Exception {

        List<Order> orders = orderRepository.findByRestaurantId(restaurantId);
        if (status != null && status.isEmpty()) {
            orders = orders.stream().filter(order -> order.getOrderStatus().equals(status)).toList();
        }
        return orders;
    }
}
