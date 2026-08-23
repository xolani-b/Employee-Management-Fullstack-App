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
@Table(name = "factory_machines")
public class FactoryMachine {

  @Id
  @Column(length = 64)
  private String id;

  @Column(nullable = false, unique = true)
  private String code;

  @Column(nullable = false)
  private String name;

  @Column(nullable = false)
  private String siteId;

  @Column(nullable = false)
  private String department;

  @Column(nullable = false)
  private String status;

  @Convert(converter = LongListConverter.class)
  @Column(name = "assigned_employee_ids", length = 512)
  private List<Long> assignedEmployeeIds = new ArrayList<>();
}
