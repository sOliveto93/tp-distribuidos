package com.example.rest;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BCrypt {
    public static void main(String args[]){
        BCryptPasswordEncoder encoder= new BCryptPasswordEncoder();
        String pass= encoder.encode("carlos");
        System.out.println(pass);
    }
}
