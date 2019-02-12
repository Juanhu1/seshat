/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package controller;

import exception.UserNotFoundException;
import dao.ClientDAOService;
import model.Clients;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.* ;
import java.net.URI;
import java.util.List;
import java.util.Optional;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.mvc.ControllerLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
public class ClientController {
    @Autowired
    private ClientDAOService service ;
    
    @GetMapping("/users")
    public List<Clients> retreiveAllClient() {
          return service.findAll() ;  
    }
    
    @GetMapping("/users/{id}")
    public Resource<Clients> retreiveClient(@PathVariable String id) {
        Optional<Clients> client= service.findOne(id) ;
        if (client==null) {
            throw new UserNotFoundException("id-"+id) ;
        }
        
        Resource<Clients> resource= new Resource<Clients>(client.get()) ;
        ControllerLinkBuilder link=linkTo(methodOn(this.getClass()).retreiveAllClient()) ;
        resource.add(link.withRel("all-users"));
        return resource ;
    }
    
    @DeleteMapping("/users/{id}")
    public void deleteClient(@PathVariable String id) {
        service.deleteById(id) ;
    }
    
    @PostMapping("/users") 
    public ResponseEntity createClient(@Valid @RequestBody Clients client)  {
        Clients savedClient = service.save(client) ;
        URI location=ServletUriComponentsBuilder.
                fromCurrentRequest().
                path("/{id}").
                buildAndExpand(savedClient.getId()).
                toUri() ;
        return ResponseEntity.created(location).build() ;
    }
               
}
