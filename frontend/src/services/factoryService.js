import { getToken, getUsername } from './authService';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const requestHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const parseResponse = async response => {
  if (!response.ok) {
    let message = `Factory API request failed with status ${response.status}`;
    try {
      const data = await response.json();
      message = data.message || data.error || message;
    } catch {
      // Keep fallback message.
    }
    throw new Error(message);
  }
  return response.json();
};

export const getFactoryState = async () => {
  const response = await fetch(`${API_BASE}/api/factory/state`, {
    method: 'GET',
    headers: requestHeaders(),
  });
  return parseResponse(response);
};

export const saveFactoryState = async payload => {
  const response = await fetch(`${API_BASE}/api/factory/state`, {
    method: 'PUT',
    headers: requestHeaders(),
    body: JSON.stringify(payload),
  });
  return parseResponse(response);
};

export const buildFactoryPayload = state => {
  const today = new Date().toISOString().slice(0, 10);
  const markedBy = getUsername() || 'system';

  return {
    shifts: state.shifts || [],
    machines: state.machines || [],
    transportRequests: state.transportRequests || [],
    incidents: state.incidents || [],
    shiftChecks: state.shiftChecks || [],
    notifications: state.notifications || [],
    attendanceRecords: (state.employees || []).map(employee => ({
      id: Number(employee.id),
      employeeId: Number(employee.id),
      workDate: today,
      siteId: employee.siteId,
      shiftId: employee.shiftId,
      machineId: employee.machineId,
      status: employee.attendance,
      weeklyHours: Number(employee.weeklyHours || 0),
      overtimeHours: Number(employee.overtimeHours || 0),
      markedBy,
      note: `Latest dashboard sync for ${employee.name}`,
    })),
  };
};

export const mergeFactoryState = (currentState, persistedState) => {
  if (!persistedState) return currentState;

  const attendanceByEmployee = new Map(
    (persistedState.attendanceRecords || []).map(record => [Number(record.employeeId), record])
  );

  return {
    ...currentState,
    shifts: persistedState.shifts?.length ? persistedState.shifts : currentState.shifts,
    machines: persistedState.machines?.length ? persistedState.machines : currentState.machines,
    transportRequests: persistedState.transportRequests || currentState.transportRequests,
    incidents: persistedState.incidents || currentState.incidents,
    shiftChecks: persistedState.shiftChecks || currentState.shiftChecks,
    notifications: persistedState.notifications || currentState.notifications,
    employees: (currentState.employees || []).map(employee => {
      const attendance = attendanceByEmployee.get(Number(employee.id));
      if (!attendance) return employee;
      return {
        ...employee,
        attendance: attendance.status || employee.attendance,
        weeklyHours: attendance.weeklyHours ?? employee.weeklyHours,
        overtimeHours: attendance.overtimeHours ?? employee.overtimeHours,
        siteId: attendance.siteId || employee.siteId,
        shiftId: attendance.shiftId || employee.shiftId,
        machineId: attendance.machineId || employee.machineId,
      };
    }),
  };
};
