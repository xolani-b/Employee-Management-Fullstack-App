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
@Table(name = "factory_notifications")
public class FactoryNotification {

  @Id private Long id;

  @Column(nullable = false)
  private String siteId;

  private String audience;

  @Lob
  @Column(nullable = false)
  private String message;

  private String priority;

  @Column(nullable = false, updatable = false)
  private Instant createdAt;

  @PrePersist
  void onCreate() {
    if (createdAt == null) {
      createdAt = Instant.now();
    }
  }
}
