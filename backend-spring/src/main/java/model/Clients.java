/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model;

import java.util.Date;
import javax.validation.constraints.Past;
import javax.validation.constraints.Size;
import org.springframework.data.annotation.Id;

/**
 *
 * @author Laci
 */
public class Clients {
    @Id
    public String  id;
    
    @Size(min=2, message="Name should have at least 2 characters")
    private String name, firstName, lastName ;
    
    @Past
    private Date birthDate ;

    
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public Date getBirthDate() {
        return birthDate;
    }
    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }
    public String toString() {
        return String.format("User id=%s, name=%s", this.id, this.name) ;
    }

    protected Clients() {
        
    }
    
    public Clients(String id, String name, Date birthDate) {
        this.id = id;
        this.name = name;
        this.birthDate = birthDate;
    }
}
