package backend.com.eatease.controller;

import backend.com.eatease.dto.OrderDto;
import backend.com.eatease.entity.Order;
import backend.com.eatease.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class OrderAdminController {


    private final OrderService orderService;

    public OrderAdminController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<OrderDto>> getAllOrders(@RequestHeader("Authorization")String jwt){
        List<OrderDto> orderDtos = orderService.getAllOrders();
        return ResponseEntity.ok(orderDtos);
    }

    @GetMapping("/restaurant/{id}/orders")
    public ResponseEntity<List<OrderDto>> getRestaurantOrders(@RequestHeader("Authorization") String jwt,
                                                             @PathVariable Long id,
                                                             @RequestParam(required = false) String status
                                                         ) throws Exception {
        return ResponseEntity.ok(orderService.getRestaurantOrders(id, status));
    }

    @PutMapping("/order/status/{id}")
    public ResponseEntity<Order> updateOrderStatus(@RequestHeader("Authorization")String jwt,
                                                   @PathVariable Long id,
                                                   @RequestParam String status
    ) throws Exception {
        Order updatedOrder = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(updatedOrder);
    }

}
