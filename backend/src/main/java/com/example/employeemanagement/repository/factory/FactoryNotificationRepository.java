package com.example.employeemanagement.repository.factory;

import com.example.employeemanagement.model.factory.FactoryNotification;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FactoryNotificationRepository extends JpaRepository<FactoryNotification, Long> {
  List<FactoryNotification> findBySiteIdIn(Collection<String> siteIds);
}
