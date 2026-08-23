package com.example.employeemanagement.repository.factory;

import com.example.employeemanagement.model.factory.FactoryIncident;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FactoryIncidentRepository extends JpaRepository<FactoryIncident, Long> {
  List<FactoryIncident> findBySiteId(String siteId);
}
