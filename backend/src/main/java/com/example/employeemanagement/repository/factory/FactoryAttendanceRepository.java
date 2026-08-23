package com.example.employeemanagement.repository.factory;

import com.example.employeemanagement.model.factory.FactoryAttendance;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FactoryAttendanceRepository extends JpaRepository<FactoryAttendance, Long> {
  List<FactoryAttendance> findByWorkDate(LocalDate workDate);

  List<FactoryAttendance> findBySiteId(String siteId);
}
