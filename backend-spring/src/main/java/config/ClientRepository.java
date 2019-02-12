/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package config;
import model.Clients;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 *
 * @author Laci
 */
public interface ClientRepository extends MongoRepository<Clients, String>{
    public Clients findByFirstName(String firstName);
    public List<Clients> findByLastName(String lastName) ;
}
