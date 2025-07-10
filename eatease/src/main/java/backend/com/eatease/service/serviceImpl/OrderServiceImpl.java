package backend.com.eatease.service.serviceImpl;

import backend.com.eatease.dto.ExtrasDto;
import backend.com.eatease.dto.OrderDto;
import backend.com.eatease.entity.*;
import backend.com.eatease.repository.*;
import backend.com.eatease.request.OrderRequest;
import backend.com.eatease.response.FoodResponse;
import backend.com.eatease.response.ImageResponse;
import backend.com.eatease.response.OrderedFoodResponse;
import backend.com.eatease.response.RestaurantSimpleResponse;
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
import java.util.Optional;

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
    public Order createOrder(OrderRequest orderRequest, User user) throws Exception {
        Cart cart = cartService.findCartByUserId(user.getId());

        if (cart == null || cart.getCartItems().isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        Long restaurantId = null;
        for (CartItem item : cart.getCartItems()) {
            Long currentRestaurantId = item.getFood().getRestaurant().getId();
            if (restaurantId == null) {
                restaurantId = currentRestaurantId;
            } else if (!restaurantId.equals(currentRestaurantId)) {
                throw new IllegalArgumentException("All items in the cart must be from the same restaurant");
            }
        }

        Restaurant restaurant = restaurantService.getRestaurantById(restaurantId);
        if (restaurant == null) throw new IllegalArgumentException("Restaurant not found");

        Address shippingAddress;
        if (orderRequest.getAddressId() != null) {
            shippingAddress = addressRepository.findById(orderRequest.getAddressId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid address ID"));
        } else {
            throw new IllegalArgumentException("Shipping address is required");
        }

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
            if (cartItem.getExtras() != null) {
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
        Order savedOrder = orderRepository.save(newOrder);

        cartService.clearCart(user.getId());

        return newOrder;
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
    public List<OrderDto> getOrdersByUserId(Long userId) throws Exception {
        List<Order> orders = orderRepository.findByCustomerId(userId);

        return orders.stream().map(this::mapOrderToDto).toList();

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
    public OrderDto mapOrderToDto(Order order) {

            User user = userRepository.findById(order.getCustomer().getId()).orElseThrow();


        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setOrderStatus(order.getOrderStatus());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setTotalOfOrder(order.getTotalOfOrder());
        dto.setUser(user);
        RestaurantSimpleResponse rest = new RestaurantSimpleResponse();
        rest.setId(order.getRestaurant().getId());
        rest.setName(order.getRestaurant().getName());
        rest.setCuisineType(order.getRestaurant().getCuisineType());
        rest.setOpeningHours(order.getRestaurant().getOpeningHours());
        rest.setClosingHours(order.getRestaurant().getClosingHours());
        dto.setRestaurant(rest);

        List<OrderedFoodResponse> orderedItems = order.getOrderedFoodList().stream().map(food -> {
            OrderedFoodResponse foodRes = new OrderedFoodResponse();
            foodRes.setId(food.getId());
            foodRes.setQuantity(food.getQuantity());
            foodRes.setTotalPrice(food.getTotalPrice());


            FoodResponse foodResponse = new FoodResponse();
            foodResponse.setId(food.getFood().getId());
            foodResponse.setFoodName(food.getFood().getFoodName());
            foodResponse.setPrice(food.getFood().getPrice());

            List<ExtrasDto> extrasDtos = food.getExtras().stream()
                    .map(extra -> new ExtrasDto(extra.getId(),extra.getName(), extra.getPrice())).toList();
            foodResponse.setExtrasList(extrasDtos);

            List<ImageResponse> imageResponses = food.getFood().getImagesList().stream()
                    .map(image -> {
                        ImageResponse imgRes = new ImageResponse();
                        imgRes.setId(image.getId());
                        imgRes.setUrl("http://localhost:8080/api/public/images/" + image.getId());
                        return imgRes;
                    }).toList();
            foodResponse.setImagesList(imageResponses);

            foodRes.setFood(foodResponse);

            return foodRes;
        }).toList();

        dto.setOrderedFoodList(orderedItems);

        return dto;
    }


}
