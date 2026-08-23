package com.example.employeemanagement.model.factory;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "factory_transport_requests")
public class FactoryTransportRequest {

  @Id private Long id;

  @Column(nullable = false)
  private Long employeeId;

  @Column(nullable = false)
  private String week;

  private String days;
  private String direction;
  private Boolean overtimeLinked;
  private String status;

  @Lob private String notes;
}
