package com.example.employeemanagement.model.factory;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "factory_shifts")
public class FactoryShift {

  @Id
  @Column(length = 64)
  private String id;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false)
  private String hours;

  @Convert(converter = StringListConverter.class)
  @Column(name = "site_ids", length = 512)
  private List<String> siteIds = new ArrayList<>();
}
