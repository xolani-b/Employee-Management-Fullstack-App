package com.example.employeemanagement.service;

import com.example.employeemanagement.dto.FactoryStateDto;
import com.example.employeemanagement.model.factory.FactoryAttendance;
import com.example.employeemanagement.model.factory.FactoryIncident;
import com.example.employeemanagement.model.factory.FactoryMachine;
import com.example.employeemanagement.model.factory.FactoryNotification;
import com.example.employeemanagement.model.factory.FactoryShift;
import com.example.employeemanagement.model.factory.FactoryShiftCheck;
import com.example.employeemanagement.model.factory.FactoryTransportRequest;
import com.example.employeemanagement.repository.factory.FactoryAttendanceRepository;
import com.example.employeemanagement.repository.factory.FactoryIncidentRepository;
import com.example.employeemanagement.repository.factory.FactoryMachineRepository;
import com.example.employeemanagement.repository.factory.FactoryNotificationRepository;
import com.example.employeemanagement.repository.factory.FactoryShiftCheckRepository;
import com.example.employeemanagement.repository.factory.FactoryShiftRepository;
import com.example.employeemanagement.repository.factory.FactoryTransportRequestRepository;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import javax.transaction.Transactional;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class FactoryDataService {

  private final FactoryShiftRepository shiftRepository;
  private final FactoryMachineRepository machineRepository;
  private final FactoryTransportRequestRepository transportRepository;
  private final FactoryIncidentRepository incidentRepository;
  private final FactoryShiftCheckRepository shiftCheckRepository;
  private final FactoryNotificationRepository notificationRepository;
  private final FactoryAttendanceRepository attendanceRepository;

  public FactoryDataService(
      FactoryShiftRepository shiftRepository,
      FactoryMachineRepository machineRepository,
      FactoryTransportRequestRepository transportRepository,
      FactoryIncidentRepository incidentRepository,
      FactoryShiftCheckRepository shiftCheckRepository,
      FactoryNotificationRepository notificationRepository,
      FactoryAttendanceRepository attendanceRepository) {
    this.shiftRepository = shiftRepository;
    this.machineRepository = machineRepository;
    this.transportRepository = transportRepository;
    this.incidentRepository = incidentRepository;
    this.shiftCheckRepository = shiftCheckRepository;
    this.notificationRepository = notificationRepository;
    this.attendanceRepository = attendanceRepository;
  }

  @Transactional
  public FactoryStateDto getState() {
    seedIfEmpty();
    return currentState();
  }

  @Transactional
  public FactoryStateDto replaceState(FactoryStateDto incoming) {
    if (incoming.getShifts() != null) {
      shiftRepository.deleteAllInBatch();
      shiftRepository.saveAll(incoming.getShifts());
    }
    if (incoming.getMachines() != null) {
      machineRepository.deleteAllInBatch();
      machineRepository.saveAll(incoming.getMachines());
    }
    if (incoming.getTransportRequests() != null) {
      transportRepository.deleteAllInBatch();
      transportRepository.saveAll(withTransportIds(incoming.getTransportRequests()));
    }
    if (incoming.getIncidents() != null) {
      incidentRepository.deleteAllInBatch();
      incidentRepository.saveAll(withIncidentIds(incoming.getIncidents()));
    }
    if (incoming.getShiftChecks() != null) {
      shiftCheckRepository.deleteAllInBatch();
      shiftCheckRepository.saveAll(withShiftCheckIds(incoming.getShiftChecks()));
    }
    if (incoming.getNotifications() != null) {
      notificationRepository.deleteAllInBatch();
      notificationRepository.saveAll(withNotificationIds(incoming.getNotifications()));
    }
    if (incoming.getAttendanceRecords() != null) {
      attendanceRepository.deleteAllInBatch();
      attendanceRepository.saveAll(withAttendanceIds(incoming.getAttendanceRecords()));
    }
    return currentState();
  }

  public List<FactoryShift> getShifts() {
    seedIfEmpty();
    return shiftRepository.findAll(Sort.by("id"));
  }

  public List<FactoryMachine> getMachines() {
    seedIfEmpty();
    return machineRepository.findAll(Sort.by("id"));
  }

  public List<FactoryTransportRequest> getTransportRequests() {
    seedIfEmpty();
    return transportRepository.findAll(Sort.by("id"));
  }

  public List<FactoryIncident> getIncidents() {
    seedIfEmpty();
    return incidentRepository.findAll(Sort.by("id"));
  }

  public List<FactoryShiftCheck> getShiftChecks() {
    seedIfEmpty();
    return shiftCheckRepository.findAll(Sort.by("id"));
  }

  public List<FactoryNotification> getNotifications() {
    seedIfEmpty();
    return notificationRepository.findAll(Sort.by("id"));
  }

  public List<FactoryAttendance> getAttendanceRecords() {
    seedIfEmpty();
    return attendanceRepository.findAll(Sort.by("id"));
  }

  private FactoryStateDto currentState() {
    FactoryStateDto state = new FactoryStateDto();
    state.setShifts(shiftRepository.findAll(Sort.by("id")));
    state.setMachines(machineRepository.findAll(Sort.by("id")));
    state.setTransportRequests(transportRepository.findAll(Sort.by("id")));
    state.setIncidents(incidentRepository.findAll(Sort.by("id")));
    state.setShiftChecks(shiftCheckRepository.findAll(Sort.by("id")));
    state.setNotifications(notificationRepository.findAll(Sort.by("id")));
    state.setAttendanceRecords(attendanceRepository.findAll(Sort.by("id")));
    return state;
  }

  private void seedIfEmpty() {
    if (shiftRepository.count() > 0) {
      return;
    }

    shiftRepository.saveAll(
        Arrays.asList(
            shift("day", "Day shift", "06:00 - 14:00", "site-a", "site-b", "site-c", "site-d", "site-e"),
            shift("afternoon", "Afternoon shift", "14:00 - 22:00", "site-a", "site-b", "site-c"),
            shift("night", "Night shift", "22:00 - 06:00", "site-a", "site-b", "site-d"),
            shift("weekend-12", "Weekend 12 hour", "07:00 - 19:00", "site-a", "site-d", "site-e")));

    machineRepository.saveAll(
        Arrays.asList(
            machine("mach-01", "EX-01", "Extruder 1", "site-a", "Extrusion", "Operational", 1L),
            machine("mach-02", "EX-02", "Extruder 2", "site-a", "Extrusion", "Operational", 2L),
            machine("mach-03", "MIX-01", "Mixer 1", "site-a", "Mixing", "Maintenance"),
            machine("mach-04", "PR-01", "Printer 1", "site-b", "Printing", "Operational", 3L),
            machine("mach-05", "PR-02", "Printer 2", "site-b", "Printing", "Operational"),
            machine("mach-06", "CUT-01", "Cutter 1", "site-c", "Cutting", "Operational", 4L),
            machine("mach-07", "CUT-02", "Cutter 2", "site-c", "Cutting", "Stopped"),
            machine("mach-08", "PK-01", "Packing Line 1", "site-d", "Packing", "Operational", 5L),
            machine("mach-09", "PK-02", "Packing Line 2", "site-d", "Packing", "Operational"),
            machine("mach-10", "WH-01", "Pallet Wrapper", "site-e", "Warehouse", "Operational", 6L)));

    transportRepository.saveAll(
        Arrays.asList(
            transport(1L, 1L, "2026-W35", "Mon-Fri", "Pickup", true, "Approved", "Day shift pickup."),
            transport(2L, 2L, "2026-W35", "Mon-Fri", "Drop off", false, "Pending", "Needs drop after shift."),
            transport(3L, 3L, "2026-W35", "Tue-Sat", "Both", true, "Approved", "Printing overtime.")));

    incidentRepository.saveAll(
        Arrays.asList(
            incident(1L, 3L, "site-b", "mach-04", "Near miss", "Medium", "Open", false, "roller-guard.jpg", "Loose roller guard near Printer 1."),
            incident(2L, 1L, "site-a", "mach-01", "Unsafe condition", "High", "Investigating", true, "oil-floor.jpg", "Oil on floor near Extruder 1.")));

    shiftCheckRepository.saveAll(
        Arrays.asList(
            shiftCheck(1L, "site-a", "day", true, true, false, "N. Dlamini", "All PPE checked."),
            shiftCheck(2L, "site-b", "afternoon", false, true, true, "A. Pillay", "One glove issue and one near miss.")));

    notificationRepository.saveAll(
        Arrays.asList(
            notification(1L, "site-a", "Day shift", "Tomorrow day shift cancelled at Site A because of a planned water interruption.", "High"),
            notification(2L, "all", "Whole company", "Payslips are available. Open My Payslip to view or report a query.", "Normal")));

    LocalDate today = LocalDate.now();
    attendanceRepository.saveAll(
        Arrays.asList(
            attendance(1L, 1L, today, "site-a", "day", "mach-01", "Present", 40D, 8D, "N. Dlamini", "Seeded attendance."),
            attendance(2L, 2L, today, "site-a", "day", "mach-02", "Absent", 32D, 0D, "N. Dlamini", "Seeded attendance."),
            attendance(3L, 3L, today, "site-b", "afternoon", "mach-04", "Present", 48D, 8D, "A. Pillay", "Seeded attendance."),
            attendance(4L, 4L, today, "site-c", "day", "mach-06", "Present", 40D, 0D, "Factory Manager", "Seeded attendance."),
            attendance(5L, 5L, today, "site-d", "weekend-12", "mach-08", "Pending", 0D, 0D, "N. Jacobs", "Seeded attendance."),
            attendance(6L, 6L, today, "site-e", "day", "mach-10", "Blocked", 0D, 0D, "M. Daniels", "Seeded attendance.")));
  }

  private FactoryShift shift(String id, String name, String hours, String... siteIds) {
    FactoryShift shift = new FactoryShift();
    shift.setId(id);
    shift.setName(name);
    shift.setHours(hours);
    shift.setSiteIds(Arrays.asList(siteIds));
    return shift;
  }

  private FactoryMachine machine(
      String id, String code, String name, String siteId, String department, String status, Long... assignedEmployeeIds) {
    FactoryMachine machine = new FactoryMachine();
    machine.setId(id);
    machine.setCode(code);
    machine.setName(name);
    machine.setSiteId(siteId);
    machine.setDepartment(department);
    machine.setStatus(status);
    machine.setAssignedEmployeeIds(Arrays.asList(assignedEmployeeIds));
    return machine;
  }

  private FactoryTransportRequest transport(
      Long id, Long employeeId, String week, String days, String direction, Boolean overtimeLinked, String status, String notes) {
    FactoryTransportRequest transport = new FactoryTransportRequest();
    transport.setId(id);
    transport.setEmployeeId(employeeId);
    transport.setWeek(week);
    transport.setDays(days);
    transport.setDirection(direction);
    transport.setOvertimeLinked(overtimeLinked);
    transport.setStatus(status);
    transport.setNotes(notes);
    return transport;
  }

  private FactoryIncident incident(
      Long id,
      Long employeeId,
      String siteId,
      String machineId,
      String type,
      String severity,
      String status,
      Boolean anonymous,
      String photoName,
      String summary) {
    FactoryIncident incident = new FactoryIncident();
    incident.setId(id);
    incident.setEmployeeId(employeeId);
    incident.setSiteId(siteId);
    incident.setMachineId(machineId);
    incident.setType(type);
    incident.setSeverity(severity);
    incident.setStatus(status);
    incident.setAnonymous(anonymous);
    incident.setPhotoName(photoName);
    incident.setSummary(summary);
    return incident;
  }

  private FactoryShiftCheck shiftCheck(
      Long id, String siteId, String shiftId, Boolean ppe, Boolean machinesSafe, Boolean incidents, String completedBy, String note) {
    FactoryShiftCheck check = new FactoryShiftCheck();
    check.setId(id);
    check.setSiteId(siteId);
    check.setShiftId(shiftId);
    check.setPpe(ppe);
    check.setMachinesSafe(machinesSafe);
    check.setIncidents(incidents);
    check.setCompletedBy(completedBy);
    check.setNote(note);
    return check;
  }

  private FactoryNotification notification(Long id, String siteId, String audience, String message, String priority) {
    FactoryNotification notification = new FactoryNotification();
    notification.setId(id);
    notification.setSiteId(siteId);
    notification.setAudience(audience);
    notification.setMessage(message);
    notification.setPriority(priority);
    return notification;
  }

  private FactoryAttendance attendance(
      Long id,
      Long employeeId,
      LocalDate workDate,
      String siteId,
      String shiftId,
      String machineId,
      String status,
      Double weeklyHours,
      Double overtimeHours,
      String markedBy,
      String note) {
    FactoryAttendance attendance = new FactoryAttendance();
    attendance.setId(id);
    attendance.setEmployeeId(employeeId);
    attendance.setWorkDate(workDate);
    attendance.setSiteId(siteId);
    attendance.setShiftId(shiftId);
    attendance.setMachineId(machineId);
    attendance.setStatus(status);
    attendance.setWeeklyHours(weeklyHours);
    attendance.setOvertimeHours(overtimeHours);
    attendance.setMarkedBy(markedBy);
    attendance.setNote(note);
    return attendance;
  }

  private List<FactoryTransportRequest> withTransportIds(List<FactoryTransportRequest> records) {
    long next = System.currentTimeMillis();
    for (FactoryTransportRequest record : records) {
      if (record.getId() == null) {
        record.setId(next++);
      }
    }
    return records;
  }

  private List<FactoryIncident> withIncidentIds(List<FactoryIncident> records) {
    long next = System.currentTimeMillis();
    for (FactoryIncident record : records) {
      if (record.getId() == null) {
        record.setId(next++);
      }
    }
    return records;
  }

  private List<FactoryShiftCheck> withShiftCheckIds(List<FactoryShiftCheck> records) {
    long next = System.currentTimeMillis();
    for (FactoryShiftCheck record : records) {
      if (record.getId() == null) {
        record.setId(next++);
      }
    }
    return records;
  }

  private List<FactoryNotification> withNotificationIds(List<FactoryNotification> records) {
    long next = System.currentTimeMillis();
    for (FactoryNotification record : records) {
      if (record.getId() == null) {
        record.setId(next++);
      }
    }
    return records;
  }

  private List<FactoryAttendance> withAttendanceIds(List<FactoryAttendance> records) {
    long next = System.currentTimeMillis();
    for (FactoryAttendance record : records) {
      if (record.getId() == null) {
        record.setId(next++);
      }
      if (record.getWorkDate() == null) {
        record.setWorkDate(LocalDate.now());
      }
    }
    return records;
  }
}
