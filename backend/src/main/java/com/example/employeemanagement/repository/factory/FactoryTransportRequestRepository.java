package com.example.employeemanagement.repository.factory;

import com.example.employeemanagement.model.factory.FactoryTransportRequest;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FactoryTransportRequestRepository extends JpaRepository<FactoryTransportRequest, Long> {
  List<FactoryTransportRequest> findByWeek(String week);
}
