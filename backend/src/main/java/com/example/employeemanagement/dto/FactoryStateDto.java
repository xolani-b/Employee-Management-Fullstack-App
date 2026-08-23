package com.example.employeemanagement.dto;

import com.example.employeemanagement.model.factory.FactoryAttendance;
import com.example.employeemanagement.model.factory.FactoryIncident;
import com.example.employeemanagement.model.factory.FactoryMachine;
import com.example.employeemanagement.model.factory.FactoryNotification;
import com.example.employeemanagement.model.factory.FactoryShift;
import com.example.employeemanagement.model.factory.FactoryShiftCheck;
import com.example.employeemanagement.model.factory.FactoryTransportRequest;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FactoryStateDto {
  private List<FactoryShift> shifts = new ArrayList<>();
  private List<FactoryMachine> machines = new ArrayList<>();
  private List<FactoryTransportRequest> transportRequests = new ArrayList<>();
  private List<FactoryIncident> incidents = new ArrayList<>();
  private List<FactoryShiftCheck> shiftChecks = new ArrayList<>();
  private List<FactoryNotification> notifications = new ArrayList<>();
  private List<FactoryAttendance> attendanceRecords = new ArrayList<>();
}
