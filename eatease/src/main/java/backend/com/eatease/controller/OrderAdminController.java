package backend.com.eatease.controller;

import backend.com.eatease.entity.Order;
import backend.com.eatease.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class OrderAdminController {

    @Autowired
    private OrderService orderService;

    @PutMapping("/order/status/{id}")
    public ResponseEntity<Order> updateOrderStatus(@RequestHeader("Authorization")String jwt,
                                                   @PathVariable Long id,
                                                   @RequestParam String status
    ) throws Exception {
        Order updatedOrder = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(updatedOrder);
    }

}
