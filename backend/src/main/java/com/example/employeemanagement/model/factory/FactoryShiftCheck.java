package com.example.employeemanagement.model.factory;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "factory_shift_checks")
public class FactoryShiftCheck {

  @Id private Long id;

  private String siteId;
  private String shiftId;
  private Boolean ppe;
  private Boolean machinesSafe;
  private Boolean incidents;
  private String completedBy;

  @Lob private String note;
}
