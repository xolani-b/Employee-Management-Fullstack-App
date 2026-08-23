package com.example.employeemanagement.model.factory;

import java.time.Instant;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "factory_incidents")
public class FactoryIncident {

  @Id private Long id;

  private Long employeeId;

  @Column(nullable = false)
  private String siteId;

  private String machineId;
  private String type;
  private String severity;
  private String status;
  @Column(name = "anonymous_report")
  private Boolean anonymous;
  private String photoName;

  @Lob private String summary;

  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  @PrePersist
  void onCreate() {
    if (createdAt == null) {
      createdAt = Instant.now();
    }
  }
}
