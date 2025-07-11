package backend.com.eatease.controller;

import backend.com.eatease.dto.OrderDto;
import backend.com.eatease.entity.Order;
import backend.com.eatease.entity.User;
import backend.com.eatease.exception.CartItemNotFoundException;
import backend.com.eatease.request.OrderRequest;
import backend.com.eatease.response.MessageResponse;
import backend.com.eatease.service.OrderService;
import backend.com.eatease.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class OrderController {

    private final OrderService orderService;

    private final UserService userService;

    public OrderController(OrderService orderService, UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
    }

    @PostMapping("/order")
    public ResponseEntity<Order> orderFood(@RequestHeader("Authorization")String jwt,
                                              @RequestBody OrderRequest request
                                           ) throws Exception, CartItemNotFoundException {
        User user = userService.findUserByJwtToken(jwt);
        Order order = orderService.createOrder(request, user);
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<MessageResponse> cancelOrder(@RequestHeader("Authorization")String jwt,
                                                       @PathVariable Long id
                                                       ) throws Exception {
        orderService.cancelOrder(id);
        MessageResponse msg = new MessageResponse();
        msg.setMessage("Order canceled!");
        return ResponseEntity.ok(msg);
    }

    @GetMapping("/user/{id}/order")
    public ResponseEntity<List<OrderDto>> getUserOrders(@RequestHeader("Authorization")String jwt,
                                                     @PathVariable Long id
                                                     ) throws Exception {
        List<OrderDto> orders = orderService.getOrdersByUserId(id);
        return ResponseEntity.ok(orders);
    }
    @GetMapping("/order/id")
    public ResponseEntity<Order> getOrderById(@RequestHeader("Authorization")String jwt,
                                              @PathVariable Long id
    ) throws Exception {
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

}
