package com.example.employeemanagement.repository.factory;

import com.example.employeemanagement.model.factory.FactoryShiftCheck;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FactoryShiftCheckRepository extends JpaRepository<FactoryShiftCheck, Long> {
  List<FactoryShiftCheck> findBySiteId(String siteId);
}
