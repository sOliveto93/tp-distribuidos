package com.example.rest;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BCrypt {
    public static void main(String args[]){
        BCryptPasswordEncoder encoder= new BCryptPasswordEncoder();
        String pass= encoder.encode("curador");
        System.out.println(pass);

System.out.println(
    encoder.matches("ana", 
    "$2a$10$UwV1YlQba/A2FJdWUvc4peRnw/7rac7xJw064aipJN0CXFS./r6ra")
);
    }
}
