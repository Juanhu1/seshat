/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.nysstudio.webservices.seshat.helloworld;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


/**
 *
 * @author LNYAKAS
 */
@RestController
public class HelloWorldController {
    @GetMapping( path="/hello-world") 
    public String helloWorld() {
        return "Hello World" ;
    }
    @GetMapping( path="/hello-world-bean") 
    public HelloWorldBean helloWorldBean() {
        return new HelloWorldBean( "Hello world" ) ;
    }
    @GetMapping( path="/hello-world-bean/{name}") 
    public HelloWorldBean helloWorldBean(@PathVariable String name) {
        return new HelloWorldBean( String.format( "Hello world - %s", name) ) ;
    }    
}
