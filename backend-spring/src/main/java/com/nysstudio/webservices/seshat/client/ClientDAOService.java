/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.nysstudio.webservices.seshat.client;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.springframework.stereotype.Component ;
/**
 *
 * @author Laci
 */
@Component
public class ClientDAOService {
    private static List<Client> clients=new ArrayList<>() ;
    private static int userCount=3 ;
    static {
        clients.add(new Client(1, "Adam", new Date())) ;
        clients.add(new Client(2, "Eve", new Date())) ;
        clients.add(new Client(3, "Jack", new Date())) ;
    }
    public List<Client> findAll() {
        return clients ;
    }
    public Client save(Client client) {
        if (client.getId()==null ) {
            client.setId(++userCount) ;
        }
        clients.add(client) ;
        return client ;
    }
    public Client findOne(int id) {
        for (Client client:clients) {
            if (client.getId()==id)
                return client ;
        }
        return null ;
    }
}
