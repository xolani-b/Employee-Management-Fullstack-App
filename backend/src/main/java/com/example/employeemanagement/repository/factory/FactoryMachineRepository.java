package com.example.employeemanagement.repository.factory;

import com.example.employeemanagement.model.factory.FactoryMachine;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FactoryMachineRepository extends JpaRepository<FactoryMachine, String> {
  List<FactoryMachine> findBySiteId(String siteId);
}
