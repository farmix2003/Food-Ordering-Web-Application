package backend.com.eatease.controller;

import backend.com.eatease.entity.Address;
import backend.com.eatease.entity.User;
import backend.com.eatease.request.ChangeUserStatusRequest;
import backend.com.eatease.response.MessageResponse;
import backend.com.eatease.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;


    @GetMapping("/admin/get-users")
    public ResponseEntity<List<User>> getAllUsers(@RequestHeader("Authorization") String jwt){
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @GetMapping("/public/profile")
    public ResponseEntity<User> findUserByJwtToken(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("/public/user/edit/{id}")
    public ResponseEntity<User> editUser(@PathVariable Long id,
                                         @RequestBody User user,
                                         @RequestHeader("Authorization") String jwt
    ){
        User updatedUser = userService.editUser(id, user);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/public/user/address/add")
    public ResponseEntity<User> addAddress( @RequestBody Address address,
                                            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userService.findUserByJwtToken(jwt);

        User updatedUser = userService.addAddress(user.getId(), address);

        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/public/user/edit/address/{addressId}")
    public ResponseEntity<User> editAddress(@PathVariable Long addressId,
                                            @RequestBody Address address,
                                            @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        User addressEditedUser = userService.editAddress(user.getId(), addressId, address);
        return ResponseEntity.ok(addressEditedUser);
    }

    @DeleteMapping("/public/user/delete/address/{id}")
    public ResponseEntity<MessageResponse> deleteAddress(@PathVariable Long id,
                                                         @RequestHeader("Authorization") String jwt
    ) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        userService.removeAddress(user, id);

        MessageResponse msg = new MessageResponse();
        msg.setMessage("Address removed successfully");
        return ResponseEntity.ok(msg);
    }

    @PutMapping("/admin/change-status/{id}")
    public ResponseEntity<User> changeUserStatus(@RequestHeader("Authorization") String jwt,
                                                 @PathVariable Long id,
                                                 @RequestBody ChangeUserStatusRequest request
    ){
        User user = userService.changeUserStatus(id, request.getStatus());
        return ResponseEntity.ok(user);
    }
}
