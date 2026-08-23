package com.example.employeemanagement.controller;

import com.example.employeemanagement.dto.FactoryStateDto;
import com.example.employeemanagement.model.factory.FactoryAttendance;
import com.example.employeemanagement.model.factory.FactoryIncident;
import com.example.employeemanagement.model.factory.FactoryMachine;
import com.example.employeemanagement.model.factory.FactoryNotification;
import com.example.employeemanagement.model.factory.FactoryShift;
import com.example.employeemanagement.model.factory.FactoryShiftCheck;
import com.example.employeemanagement.model.factory.FactoryTransportRequest;
import com.example.employeemanagement.service.FactoryDataService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/factory")
public class FactoryDataController {

  private final FactoryDataService factoryDataService;

  public FactoryDataController(FactoryDataService factoryDataService) {
    this.factoryDataService = factoryDataService;
  }

  @GetMapping("/state")
  public FactoryStateDto getState() {
    return factoryDataService.getState();
  }

  @PutMapping("/state")
  public FactoryStateDto replaceState(@RequestBody FactoryStateDto state) {
    return factoryDataService.replaceState(state);
  }

  @GetMapping("/shifts")
  public List<FactoryShift> getShifts() {
    return factoryDataService.getShifts();
  }

  @GetMapping("/machines")
  public List<FactoryMachine> getMachines() {
    return factoryDataService.getMachines();
  }

  @GetMapping("/transport-requests")
  public List<FactoryTransportRequest> getTransportRequests() {
    return factoryDataService.getTransportRequests();
  }

  @GetMapping("/incidents")
  public List<FactoryIncident> getIncidents() {
    return factoryDataService.getIncidents();
  }

  @GetMapping("/shift-checks")
  public List<FactoryShiftCheck> getShiftChecks() {
    return factoryDataService.getShiftChecks();
  }

  @GetMapping("/notifications")
  public List<FactoryNotification> getNotifications() {
    return factoryDataService.getNotifications();
  }

  @GetMapping("/attendance")
  public List<FactoryAttendance> getAttendanceRecords() {
    return factoryDataService.getAttendanceRecords();
  }
}
