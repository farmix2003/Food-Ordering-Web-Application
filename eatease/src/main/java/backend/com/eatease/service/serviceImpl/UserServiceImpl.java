package backend.com.eatease.service.serviceImpl;

import backend.com.eatease.config.JwtProvider;
import backend.com.eatease.entity.Address;
import backend.com.eatease.entity.User;
import backend.com.eatease.repository.UserRepository;
import backend.com.eatease.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private JwtProvider jwtProvider;


    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User findUserByJwtToken(String token) throws Exception {
        String email =jwtProvider.getEmailFromJwt(token);
        return userRepository.findByEmail(email);
    }

    @Override
    public User findUserByEmail(String email) throws Exception {
        User user =userRepository.findByEmail(email);
        if(user == null){
            throw new Exception("User not found");
        }
        return user;
    }

    @Override
    public Optional<User> findUserById(Long id) {
        return Optional.of(userRepository.findById(id).orElseThrow());
    }

    @Override
    public User changeUserStatus(Long id, String status) {

        User user = findUserById(id).orElseThrow();
        user.setStatus(status);

        return userRepository.save(user);
    }

    @Override
    public User editUser(Long id, User user) {
        User user1 = findUserById(id).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        user1.setPhoneNumber(user.getPhoneNumber());
        user1.setUsername(user.getUsername());
        user1.setWhatsAppNumber(user.getWhatsAppNumber());

        return userRepository.save(user1);
    }

    @Override
    public User addAddress(Long id, Address address) {
        User user = findUserById(id).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Address newAddress = new Address();
        newAddress.setApartment(address.getApartment());
        newAddress.setCityName(address.getCityName());
        newAddress.setStreetName(address.getStreetName());

        user.getAddressList().add(newAddress);

        return userRepository.save(user);
    }

    @Override
    public User editAddress(Long userId, Long addressId, Address req) {

        User user = findUserById(userId).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        user.getAddressList().forEach(address ->{
            if(Objects.equals(address.getId(), addressId)){
                address.setStreetName(req.getStreetName());
                address.setApartment(req.getApartment());
                address.setCityName(req.getCityName());
            }
        });
        return userRepository.save(user);
    }

    @Override
    public void removeAddress(User user, Long id) {
        user.getAddressList().removeIf(address -> address.getId().equals(id));
        userRepository.save(user);
    }
}
