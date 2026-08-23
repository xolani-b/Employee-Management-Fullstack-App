package com.example.employeemanagement.model.factory;

import java.time.LocalDate;
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
@Table(name = "factory_attendance")
public class FactoryAttendance {

  @Id private Long id;

  @Column(nullable = false)
  private Long employeeId;

  @Column(nullable = false)
  private LocalDate workDate;

  private String siteId;
  private String shiftId;
  private String machineId;
  private String status;
  private Double weeklyHours;
  private Double overtimeHours;
  private String markedBy;

  @Lob private String note;
}
