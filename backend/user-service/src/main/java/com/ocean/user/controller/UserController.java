package com.ocean.user.controller;

import com.ocean.user.dto.LoginRequest;
import com.ocean.user.dto.RegisterRequest;
import com.ocean.user.entity.User;
import com.ocean.user.service.UserService;
import com.ocean.common.response.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@Api(tags = "用户管理")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @ApiOperation("用户注册")
    @PostMapping("/register")
    public Result<User> register(@RequestBody RegisterRequest request) {
        return Result.success(userService.register(request));
    }

    @ApiOperation("用户登录")
    @PostMapping("/login")
    public Result<Map<String, String>> login(@RequestBody LoginRequest request) {
        return Result.success(userService.login(request));
    }

    @ApiOperation("获取当前用户信息")
    @GetMapping("/me")
    public Result<User> getMe(Authentication authentication) {
        String username = authentication.getName();
        return Result.success(userService.findByUsername(username));
    }
}
