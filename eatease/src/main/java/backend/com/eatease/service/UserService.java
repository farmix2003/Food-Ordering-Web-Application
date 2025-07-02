package backend.com.eatease.service;

import backend.com.eatease.entity.Address;
import backend.com.eatease.entity.User;

import java.util.List;
import java.util.Optional;


public interface UserService {

    List<User> getAllUsers();

    User findUserByJwtToken(String token) throws Exception;

    User findUserByEmail(String email) throws Exception;

    Optional<User> findUserById(Long id);
    User changeUserStatus(Long id, String status);

    User editUser(Long id, User user);

    User addAddress(Long id, Address address);

    User editAddress(Long userId, Long addressId,  Address req);

    void removeAddress(User user, Long id);
}