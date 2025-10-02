package com.hrushikesh.ecomProducts.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Date;

@Component
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private String description;
    private String brand;
    private BigDecimal price;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date releaseDate;
    private String category;
    private boolean productAvailable;
    private int stockQuantity;
    private String imageName;
    private String imageType;
    // Large object to store image as a data in database
    @Lob
    private byte[] imageData;

    public Product(int id){ //To set id -1 in service if no product found from database
        this.id = id;
    }

}
