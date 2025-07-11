package backend.com.eatease.service;

import backend.com.eatease.dto.OrderDto;
import backend.com.eatease.entity.Order;
import backend.com.eatease.entity.User;
import backend.com.eatease.exception.CartItemNotFoundException;
import backend.com.eatease.request.OrderRequest;

import java.util.List;

public interface OrderService {
    Order createOrder(OrderRequest order, User user) throws Exception, CartItemNotFoundException;
    Order updateOrderStatus(Long orderId, String status) throws Exception;
    void cancelOrder(Long orderId) throws Exception;
    List<OrderDto> getOrdersByUserId(Long userId) throws Exception;
    Order getOrderById(Long orderId) throws Exception;
    List<OrderDto> getRestaurantOrders(Long restaurantId, String status) throws Exception;
    OrderDto mapOrderToDto(Order order);
}
