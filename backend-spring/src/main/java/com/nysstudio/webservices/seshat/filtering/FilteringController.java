/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.nysstudio.webservices.seshat.filtering;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FilteringController {
    @GetMapping("/filtering")
    public SomeBean retreiveSomeBean() {
        return new SomeBean("v1", "v2", "v3") ;
    }
}
