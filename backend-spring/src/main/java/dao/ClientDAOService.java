/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dao;

import config.ClientRepository;
import model.Clients;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component ;
/**
 *
 * @author Laci
 */
@Component
public class ClientDAOService {
    @Autowired
    private ClientRepository repo ;

    public List<Clients> findAll() {
        
        return this.repo.findAll() ;
    }
    public Clients save(Clients client) {
        Clients newClient=this.repo.save(client);        
        return newClient ;
    }
    public Optional<Clients> findOne(String id) {
        return repo.findById(id);
    }
    
    public void deleteById( String id ) {
        repo.deleteById(id);
    }
}
