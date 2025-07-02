package backend.com.eatease.controller;

import backend.com.eatease.config.JwtProvider;
import backend.com.eatease.entity.Cart;
import backend.com.eatease.entity.USER_ROLE;
import backend.com.eatease.entity.User;
import backend.com.eatease.exception.UserAlreadyExistsException;
import backend.com.eatease.repository.CartRepository;
import backend.com.eatease.repository.UserRepository;
import backend.com.eatease.request.LoginRequest;
import backend.com.eatease.request.SignupReq;
import backend.com.eatease.response.AuthResponse;
import backend.com.eatease.service.CustomerUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Collection;
import java.util.Objects;

@Controller
@RequestMapping("api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private CustomerUserDetailsService customerUserDetailsService;

    @Autowired
    private CartRepository cartRepository;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createNewUser(@Validated @RequestBody SignupReq user) throws UserAlreadyExistsException {

       User isUserExist = userRepository.findByEmail(user.getEmail());

        if (isUserExist != null) {
            throw new UserAlreadyExistsException("User with email " + user.getEmail() + " already exists");
        }

        User newUser = new User();
        newUser.setEmail(user.getEmail());
        newUser.setUsername(user.getUsername());
        newUser.setRole(user.getRole());
        newUser.setPhoneNumber(user.getPhoneNumber());
        newUser.setWhatsAppNumber(user.getWhatsAppNumber());
        if(user.getPassword().isEmpty() || user.getPassword() == null) throw new IllegalArgumentException("Password is null");
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setStatus("active");
        System.out.println(newUser);

        User savedUser = userRepository.save(newUser);

        Cart cartUser = new Cart();
        cartUser.setCustomer(savedUser);
        cartRepository.save(cartUser);

        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtProvider.generateToken(authentication);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("Successfully created new user");
        authResponse.setRole(user.getRole());

        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signIn(@Validated @RequestBody LoginRequest user) {
        String email = user.getEmail();
        String password = user.getPassword();

        User user1 = userRepository.findByEmail(email);
        if (Objects.equals(user1.getStatus(), "blocked")){
            AuthResponse response = new AuthResponse();
            response.setMessage("User is blocked by admin");
            return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
        }

        if(user1 == null){
           throw new RuntimeException("User not found");
        }

        Authentication authentication = authenticate(email, password);

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String role = authorities.isEmpty() ? null : authorities.iterator().next().getAuthority();

        String jwt = jwtProvider.generateToken(authentication);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setMessage("Successfully logged in");
        authResponse.setRole(USER_ROLE.valueOf(role));

        return new ResponseEntity<>(authResponse, HttpStatus.OK);

    }

    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout(@RequestHeader("Authorization") String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            AuthResponse errorResponse = new AuthResponse();
            errorResponse.setMessage("Invalid token");
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        String jwt = token.substring(7);
        jwtProvider.addToBlackList(jwt);
        SecurityContextHolder.clearContext();

        AuthResponse authResponse = new AuthResponse();
        authResponse.setMessage("Logged out successfully");
        authResponse.setJwt(null);
        authResponse.setRole(null);

        return new ResponseEntity<>(authResponse, HttpStatus.OK);
    }

    private Authentication authenticate(String email, String password) {
        UserDetails userDetails = customerUserDetailsService.loadUserByUsername(email);

        if (userDetails == null) {
            throw new BadCredentialsException("Invalid email...!");
        }
        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid password...!");
        }
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }


}
