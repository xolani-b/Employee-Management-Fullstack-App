import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import {
  AccessTime,
  Badge,
  Cake,
  CloudDone,
  CloudOff,
  DirectionsBus,
  Engineering,
  FactCheck,
  HealthAndSafety,
  NotificationsActive,
  PersonOff,
  PictureAsPdf,
  Psychology,
  Security,
  UploadFile,
} from '@mui/icons-material';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { getUsername } from '../services/authService';
import { buildFactoryPayload, getFactoryState, mergeFactoryState, saveFactoryState } from '../services/factoryService';

Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, ArcElement);

const STORAGE_KEY = 'factory-work-app-state-v1';
const QUEUE_KEY = 'factory-work-app-offline-queue-v1';

const sites = [
  { id: 'all', name: 'Whole company' },
  { id: 'site-a', name: 'Site A - Extrusion' },
  { id: 'site-b', name: 'Site B - Printing' },
  { id: 'site-c', name: 'Site C - Cutting' },
  { id: 'site-d', name: 'Site D - Packing' },
  { id: 'site-e', name: 'Site E - Warehouse' },
];

const defaultShifts = [
  { id: 'day', name: 'Day shift', hours: '06:00 - 14:00', siteIds: ['site-a', 'site-b', 'site-c', 'site-d', 'site-e'] },
  { id: 'afternoon', name: 'Afternoon shift', hours: '14:00 - 22:00', siteIds: ['site-a', 'site-b', 'site-c'] },
  { id: 'night', name: 'Night shift', hours: '22:00 - 06:00', siteIds: ['site-a', 'site-b', 'site-d'] },
  { id: 'weekend-12', name: 'Weekend 12 hour', hours: '07:00 - 19:00', siteIds: ['site-a', 'site-d', 'site-e'] },
];

const initialState = {
  shifts: defaultShifts,
  employees: [
    {
      id: 1,
      name: 'Xolani Maseko',
      employeeNo: 'EMP001',
      role: 'Worker',
      siteId: 'site-a',
      department: 'Extrusion',
      shiftId: 'day',
      supervisor: 'N. Dlamini',
      machineId: 'mach-01',
      status: 'Approved',
      attendance: 'Present',
      weeklyHours: 40,
      overtimeHours: 8,
      phone: '071 000 0001',
      address: 'Unit 4, Germiston',
      age: 30,
      dateOfBirth: '1996-08-24',
      emergencyName: 'Sipho Maseko',
      emergencyPhone: '072 000 0001',
      profilePhoto: '',
      transport: 'Pickup',
      payslipStatus: 'Available',
    },
    {
      id: 2,
      name: 'Thandi Nkosi',
      employeeNo: 'EMP002',
      role: 'Worker',
      siteId: 'site-a',
      department: 'Extrusion',
      shiftId: 'day',
      supervisor: 'N. Dlamini',
      machineId: 'mach-02',
      status: 'Approved',
      attendance: 'Absent',
      weeklyHours: 32,
      overtimeHours: 0,
      phone: '071 000 0002',
      address: 'Katlehong',
      age: 27,
      dateOfBirth: '1999-09-02',
      emergencyName: 'Bongani Nkosi',
      emergencyPhone: '072 000 0002',
      profilePhoto: '',
      transport: 'Drop off',
      payslipStatus: 'Available',
    },
    {
      id: 3,
      name: 'Musa Mthembu',
      employeeNo: 'EMP003',
      role: 'Worker',
      siteId: 'site-b',
      department: 'Printing',
      shiftId: 'afternoon',
      supervisor: 'A. Pillay',
      machineId: 'mach-04',
      status: 'Approved',
      attendance: 'Present',
      weeklyHours: 48,
      overtimeHours: 8,
      phone: '071 000 0003',
      address: 'Boksburg',
      age: 35,
      dateOfBirth: '1991-08-28',
      emergencyName: 'Lebo Mthembu',
      emergencyPhone: '072 000 0003',
      profilePhoto: '',
      transport: 'Both',
      payslipStatus: 'Query open',
    },
    {
      id: 4,
      name: 'Nomsa Khumalo',
      employeeNo: 'EMP004',
      role: 'Supervisor',
      siteId: 'site-c',
      department: 'Cutting',
      shiftId: 'day',
      supervisor: 'Factory Manager',
      machineId: 'mach-06',
      status: 'Approved',
      attendance: 'Present',
      weeklyHours: 40,
      overtimeHours: 0,
      phone: '071 000 0004',
      address: 'Springs',
      age: 41,
      dateOfBirth: '1985-08-30',
      emergencyName: 'Sizwe Khumalo',
      emergencyPhone: '072 000 0004',
      profilePhoto: '',
      transport: 'None',
      payslipStatus: 'Available',
    },
    {
      id: 5,
      name: 'Peter van Wyk',
      employeeNo: 'EMP005',
      role: 'Worker',
      siteId: 'site-d',
      department: 'Packing',
      shiftId: 'weekend-12',
      supervisor: 'N. Jacobs',
      machineId: 'mach-08',
      status: 'Pending approval',
      attendance: 'Pending',
      weeklyHours: 0,
      overtimeHours: 0,
      phone: '071 000 0005',
      address: 'Benoni',
      age: 24,
      dateOfBirth: '2002-10-10',
      emergencyName: 'Anna van Wyk',
      emergencyPhone: '072 000 0005',
      profilePhoto: '',
      transport: 'None',
      payslipStatus: 'Not ready',
    },
    {
      id: 6,
      name: 'Ayanda Sithole',
      employeeNo: 'EMP006',
      role: 'Worker',
      siteId: 'site-e',
      department: 'Warehouse',
      shiftId: 'day',
      supervisor: 'M. Daniels',
      machineId: 'mach-10',
      status: 'Suspended',
      attendance: 'Blocked',
      weeklyHours: 0,
      overtimeHours: 0,
      phone: '071 000 0006',
      address: 'Vosloorus',
      age: 31,
      dateOfBirth: '1995-08-23',
      emergencyName: 'Lindiwe Sithole',
      emergencyPhone: '072 000 0006',
      profilePhoto: '',
      transport: 'None',
      payslipStatus: 'Blocked',
    },
  ],
  machines: [
    { id: 'mach-01', code: 'EX-01', name: 'Extruder 1', siteId: 'site-a', department: 'Extrusion', status: 'Operational', assignedEmployeeIds: [1] },
    { id: 'mach-02', code: 'EX-02', name: 'Extruder 2', siteId: 'site-a', department: 'Extrusion', status: 'Operational', assignedEmployeeIds: [2] },
    { id: 'mach-03', code: 'MIX-01', name: 'Mixer 1', siteId: 'site-a', department: 'Mixing', status: 'Maintenance', assignedEmployeeIds: [] },
    { id: 'mach-04', code: 'PR-01', name: 'Printer 1', siteId: 'site-b', department: 'Printing', status: 'Operational', assignedEmployeeIds: [3] },
    { id: 'mach-05', code: 'PR-02', name: 'Printer 2', siteId: 'site-b', department: 'Printing', status: 'Operational', assignedEmployeeIds: [] },
    { id: 'mach-06', code: 'CUT-01', name: 'Cutter 1', siteId: 'site-c', department: 'Cutting', status: 'Operational', assignedEmployeeIds: [4] },
    { id: 'mach-07', code: 'CUT-02', name: 'Cutter 2', siteId: 'site-c', department: 'Cutting', status: 'Stopped', assignedEmployeeIds: [] },
    { id: 'mach-08', code: 'PK-01', name: 'Packing Line 1', siteId: 'site-d', department: 'Packing', status: 'Operational', assignedEmployeeIds: [5] },
    { id: 'mach-09', code: 'PK-02', name: 'Packing Line 2', siteId: 'site-d', department: 'Packing', status: 'Operational', assignedEmployeeIds: [] },
    { id: 'mach-10', code: 'WH-01', name: 'Pallet Wrapper', siteId: 'site-e', department: 'Warehouse', status: 'Operational', assignedEmployeeIds: [6] },
  ],
  transportRequests: [
    { id: 1, employeeId: 1, week: '2026-W35', days: 'Mon-Fri', direction: 'Pickup', overtimeLinked: true, status: 'Approved', notes: 'Day shift pickup.' },
    { id: 2, employeeId: 2, week: '2026-W35', days: 'Mon-Fri', direction: 'Drop off', overtimeLinked: false, status: 'Pending', notes: 'Needs drop after shift.' },
    { id: 3, employeeId: 3, week: '2026-W35', days: 'Tue-Sat', direction: 'Both', overtimeLinked: true, status: 'Approved', notes: 'Printing overtime.' },
  ],
  incidents: [
    { id: 1, employeeId: 3, siteId: 'site-b', machineId: 'mach-04', type: 'Near miss', severity: 'Medium', status: 'Open', anonymous: false, photoName: 'roller-guard.jpg', summary: 'Loose roller guard near Printer 1.' },
    { id: 2, employeeId: 1, siteId: 'site-a', machineId: 'mach-01', type: 'Unsafe condition', severity: 'High', status: 'Investigating', anonymous: true, photoName: 'oil-floor.jpg', summary: 'Oil on floor near Extruder 1.' },
  ],
  shiftChecks: [
    { id: 1, siteId: 'site-a', shiftId: 'day', ppe: true, machinesSafe: true, incidents: false, completedBy: 'N. Dlamini', note: 'All PPE checked.' },
    { id: 2, siteId: 'site-b', shiftId: 'afternoon', ppe: false, machinesSafe: true, incidents: true, completedBy: 'A. Pillay', note: 'One glove issue and one near miss.' },
  ],
  notifications: [
    { id: 1, siteId: 'site-a', audience: 'Day shift', message: 'Tomorrow day shift cancelled at Site A because of a planned water interruption.', priority: 'High' },
    { id: 2, siteId: 'all', audience: 'Whole company', message: 'Payslips are available. Open My Payslip to view or report a query.', priority: 'Normal' },
  ],
  cases: [
    { id: 1, employeeId: 3, type: 'Pay short', owner: 'Payroll', status: 'Open', summary: 'Overtime on Saturday not visible on payslip.' },
    { id: 2, employeeId: 1, type: 'HR request', owner: 'HR', status: 'In progress', summary: 'Address update needs verification.' },
  ],
};

const roleOptions = ['Worker', 'Supervisor', 'HR Officer', 'Payroll', 'Safety Officer', 'Factory Manager', 'Admin/IT'];

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
};

const getSiteName = siteId => sites.find(site => site.id === siteId)?.name || 'Unknown site';
const getShift = (shiftId, shiftList = defaultShifts) => shiftList.find(shift => shift.id === shiftId);

const csvEscape = value => `"${String(value ?? '').replace(/"/g, '""')}"`;

const downloadCsv = (filename, rows) => {
  const csv = rows.map(row => row.map(csvEscape).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const createChartData = (labels, values, label, colors) => ({
  labels,
  datasets: [
    {
      label,
      data: values,
      backgroundColor: colors || ['#1E3C72', '#ff9800', '#42A5F5', '#66BB6A', '#F06292'],
      borderColor: '#ffffff',
      borderWidth: 1,
    },
  ],
});

const StatCard = ({ title, value, helper, icon, gradient, darkText = false }) => (
  <Card
    sx={{
      height: '100%',
      background: gradient,
      color: darkText ? '#0f172a' : '#fff',
      boxShadow: '0 20px 55px rgba(14, 30, 68, 0.12)',
      border: '1px solid rgba(15, 23, 42, 0.06)',
    }}
  >
    <CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
        <Box>
          <Typography variant="body2" sx={{ opacity: 0.85, fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
            {value}
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: darkText ? '#1E3C72' : '#fff' }}>{icon}</Avatar>
      </Stack>
      <Typography variant="body2" sx={{ mt: 1, opacity: 0.85 }}>
        {helper}
      </Typography>
    </CardContent>
  </Card>
);

const SectionCard = ({ title, subtitle, action, children }) => (
  <Card sx={{ height: '100%', boxShadow: '0 16px 45px rgba(14, 30, 68, 0.1)', border: '1px solid rgba(15, 23, 42, 0.06)' }}>
    <CardContent>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1} sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {action}
      </Stack>
      {children}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const username = getUsername() || 'admin';
  const [state, setState] = useState(() => readJson(STORAGE_KEY, initialState));
  const [queue, setQueue] = useState(() => readJson(QUEUE_KEY, []));
  const [siteFilter, setSiteFilter] = useState('all');
  const [roleView, setRoleView] = useState('Admin/IT');
  const [activeTab, setActiveTab] = useState(0);
  const [actingEmployeeId, setActingEmployeeId] = useState(1);
  const [offlineMode, setOfflineMode] = useState(false);
  const [browserOnline, setBrowserOnline] = useState(navigator.onLine);
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatAnswer, setChatAnswer] = useState('Ask about shift times, public holidays, payslips, PPE, transport, incidents, or packing SOPs.');
  const [newNotification, setNewNotification] = useState('');
  const [incidentSummary, setIncidentSummary] = useState('');
  const [transportWeek, setTransportWeek] = useState('2026-W35');
  const [syncStatus, setSyncStatus] = useState('Loading MySQL factory data...');
  const [lastSync, setLastSync] = useState('');

  const online = browserOnline && !offlineMode;

  useEffect(() => {
    const onOnline = () => setBrowserOnline(true);
    const onOffline = () => setBrowserOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [online]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }, [queue]);

  useEffect(() => {
    let cancelled = false;

    const loadFactoryState = async () => {
      if (!online) {
        setSyncStatus('Offline mode: using local saved data');
        return;
      }

      try {
        const persistedState = await getFactoryState();
        if (cancelled) return;
        setState(current => {
          const merged = mergeFactoryState({ ...initialState, ...current, shifts: current.shifts || defaultShifts }, persistedState);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          return merged;
        });
        setLastSync(new Date().toLocaleTimeString());
        setSyncStatus('Synced with MySQL');
      } catch (error) {
        if (!cancelled) {
          setSyncStatus(`Using local data: ${error.message}`);
        }
      }
    };

    loadFactoryState();

    return () => {
      cancelled = true;
    };
  }, [online]);

  const employees = state.employees;
  const shiftList = state.shifts || defaultShifts;
  const visibleEmployees = useMemo(
    () => employees.filter(employee => siteFilter === 'all' || employee.siteId === siteFilter),
    [employees, siteFilter]
  );
  const visibleMachines = state.machines.filter(machine => siteFilter === 'all' || machine.siteId === siteFilter);
  const visibleIncidents = state.incidents.filter(incident => siteFilter === 'all' || incident.siteId === siteFilter);
  const actingEmployee = employees.find(employee => employee.id === actingEmployeeId) || employees[0];

  const addQueuedAction = useCallback(label => {
    setQueue(current => [
      ...current,
      {
        id: Date.now(),
        label,
        savedAt: new Date().toLocaleString(),
      },
    ]);
  }, []);

  const persistFactoryState = useCallback(async (nextState, label = 'Factory data saved') => {
    if (!online) {
      addQueuedAction(label);
      setSyncStatus('Offline mode: change saved locally and queued for MySQL sync');
      return;
    }

    try {
      setSyncStatus('Saving factory data to MySQL...');
      await saveFactoryState(buildFactoryPayload(nextState));
      setLastSync(new Date().toLocaleTimeString());
      setSyncStatus('Saved to MySQL');
      if (queue.length > 0) {
        setQueue([]);
      }
    } catch (error) {
      addQueuedAction(`${label} (MySQL retry needed)`);
      setSyncStatus(`MySQL save failed, queued locally: ${error.message}`);
    }
  }, [addQueuedAction, online, queue.length]);

  const updateState = (label, updater) => {
    const nextState = updater(state);
    setState(nextState);
    persistFactoryState(nextState, label);
  };

  useEffect(() => {
    if (online && queue.length > 0) {
      const timer = setTimeout(() => {
        persistFactoryState(state, 'Offline queue synced to MySQL');
      }, 900);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [online, queue.length, persistFactoryState, state]);

  const siteTrendRows = sites
    .filter(site => site.id !== 'all')
    .map(site => {
      const siteEmployees = employees.filter(employee => employee.siteId === site.id);
      const absent = siteEmployees.filter(employee => employee.attendance === 'Absent').length;
      const hours = siteEmployees.reduce((sum, employee) => sum + employee.weeklyHours, 0);
      const operational = state.machines.filter(machine => machine.siteId === site.id && machine.status === 'Operational').length;
      return {
        site,
        headcount: siteEmployees.length,
        absent,
        absenceRate: siteEmployees.length ? Math.round((absent / siteEmployees.length) * 100) : 0,
        hours,
        operational,
      };
    });

  const birthdays = visibleEmployees
    .filter(employee => employee.dateOfBirth?.slice(5, 7) === '08')
    .sort((a, b) => a.dateOfBirth.localeCompare(b.dateOfBirth));

  const metrics = {
    approved: visibleEmployees.filter(employee => employee.status === 'Approved').length,
    pending: visibleEmployees.filter(employee => employee.status === 'Pending approval').length,
    suspended: visibleEmployees.filter(employee => employee.status === 'Suspended').length,
    absent: visibleEmployees.filter(employee => employee.attendance === 'Absent').length,
    weeklyHours: visibleEmployees.reduce((sum, employee) => sum + employee.weeklyHours, 0),
    overtime: visibleEmployees.reduce((sum, employee) => sum + employee.overtimeHours, 0),
    operationalMachines: visibleMachines.filter(machine => machine.status === 'Operational').length,
    openIncidents: visibleIncidents.filter(incident => incident.status !== 'Closed').length,
  };

  const absenteeismChart = createChartData(
    siteTrendRows.map(row => row.site.name.replace('Site ', '')),
    siteTrendRows.map(row => row.absent),
    'Absent workers',
    ['#ef5350', '#ff9800', '#42A5F5', '#66BB6A', '#7E57C2']
  );

  const hoursChart = {
    labels: siteTrendRows.map(row => row.site.name.replace('Site ', '')),
    datasets: [
      {
        label: 'Total hours worked this week',
        data: siteTrendRows.map(row => row.hours),
        borderColor: '#1E3C72',
        backgroundColor: 'rgba(30, 60, 114, 0.15)',
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const incidentChart = createChartData(
    ['High', 'Medium', 'Low'],
    ['High', 'Medium', 'Low'].map(severity => visibleIncidents.filter(incident => incident.severity === severity).length),
    'Incidents',
    ['#e53935', '#ff9800', '#66BB6A']
  );

  const handleAttendance = (employeeId, attendance) => {
    updateState(`Attendance changed to ${attendance}`, current => ({
      ...current,
      employees: current.employees.map(employee => (employee.id === employeeId ? { ...employee, attendance } : employee)),
    }));
  };

  const handleUserStatus = (employeeId, status) => {
    updateState(`User status changed to ${status}`, current => ({
      ...current,
      employees: current.employees.map(employee => (employee.id === employeeId ? { ...employee, status } : employee)),
    }));
  };

  const handleTransportDecision = (requestId, direction, status) => {
    updateState('Transport request updated', current => ({
      ...current,
      transportRequests: current.transportRequests.map(request =>
        request.id === requestId ? { ...request, direction: direction || request.direction, status: status || request.status } : request
      ),
    }));
  };

  const handleMachineAssign = (machineId, employeeId) => {
    updateState('Machine assignment updated', current => ({
      ...current,
      machines: current.machines.map(machine =>
        machine.id === machineId
          ? {
              ...machine,
              assignedEmployeeIds: Array.from(new Set([...machine.assignedEmployeeIds, employeeId])),
            }
          : machine
      ),
      employees: current.employees.map(employee => (employee.id === employeeId ? { ...employee, machineId } : employee)),
    }));
  };

  const handleChecklistToggle = (checkId, field) => {
    updateState('Shift checklist updated', current => ({
      ...current,
      shiftChecks: current.shiftChecks.map(check => (check.id === checkId ? { ...check, [field]: !check[field] } : check)),
    }));
  };

  const handleProfilePhoto = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateState('Profile photo uploaded', current => ({
        ...current,
        employees: current.employees.map(employee => (employee.id === actingEmployee.id ? { ...employee, profilePhoto: reader.result } : employee)),
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleIncidentPhoto = event => {
    const file = event.target.files?.[0];
    const employee = actingEmployee;
    const nextId = Math.max(...state.incidents.map(incident => incident.id), 0) + 1;
    updateState('Incident report captured', current => ({
      ...current,
      incidents: [
        {
          id: nextId,
          employeeId: employee.id,
          siteId: employee.siteId,
          machineId: employee.machineId,
          type: 'Unsafe condition',
          severity: incidentSummary.toLowerCase().includes('blood') || incidentSummary.toLowerCase().includes('guard') ? 'High' : 'Medium',
          status: 'Open',
          anonymous: false,
          photoName: file?.name || 'No photo uploaded',
          summary: incidentSummary || 'New incident captured from worker dashboard.',
        },
        ...current.incidents,
      ],
    }));
    setIncidentSummary('');
  };

  const handleSendNotification = () => {
    if (!newNotification.trim()) return;
    updateState('Notification sent', current => ({
      ...current,
      notifications: [
        {
          id: Date.now(),
          siteId: siteFilter,
          audience: siteFilter === 'all' ? 'Whole company' : getSiteName(siteFilter),
          message: newNotification.trim(),
          priority: newNotification.toLowerCase().includes('cancel') ? 'High' : 'Normal',
        },
        ...current.notifications,
      ],
    }));
    setNewNotification('');
  };

  const handleTransportRequest = () => {
    const nextId = Math.max(...state.transportRequests.map(request => request.id), 0) + 1;
    updateState('Transport requested', current => ({
      ...current,
      transportRequests: [
        {
          id: nextId,
          employeeId: actingEmployee.id,
          week: transportWeek,
          days: 'Mon-Fri',
          direction: 'Needs decision',
          overtimeLinked: false,
          status: 'Pending',
          notes: 'Worker requested transport from app.',
        },
        ...current.transportRequests,
      ],
    }));
  };

  const exportTransport = () => {
    const rows = [
      ['Employee', 'Employee No', 'Site', 'Department', 'Shift', 'Week', 'Pickup/Drop', 'Overtime', 'Supervisor', 'Status', 'Notes'],
      ...state.transportRequests.map(request => {
        const employee = employees.find(item => item.id === request.employeeId);
        return [
          employee?.name,
          employee?.employeeNo,
          getSiteName(employee?.siteId),
          employee?.department,
          getShift(employee?.shiftId, shiftList)?.name,
          request.week,
          request.direction,
          request.overtimeLinked ? 'Yes' : 'No',
          employee?.supervisor,
          request.status,
          request.notes,
        ];
      }),
    ];
    downloadCsv('weekly-transport-export.csv', rows);
  };

  const askChatbot = () => {
    const q = chatQuestion.toLowerCase();
    if (!q.trim()) return;
    if (q.includes('public holiday')) {
      setChatAnswer('The next public holiday should be checked against the South African public holiday calendar. The app can connect to a holiday API or HR calendar for the final answer.');
    } else if (q.includes('start') || q.includes('shift')) {
      setChatAnswer(`Your current shift is ${getShift(actingEmployee.shiftId, shiftList)?.name} (${getShift(actingEmployee.shiftId, shiftList)?.hours}) at ${getSiteName(actingEmployee.siteId)}.`);
    } else if (q.includes('pack') || q.includes('box')) {
      setChatAnswer('Packing SOP: check product code, confirm quantity, inspect box quality, pack according to customer spec, seal, label, and move to the correct pallet.');
    } else if (q.includes('payslip') || q.includes('pay')) {
      setChatAnswer('Open My Payslip to view your payslip. If overtime or normal hours look wrong, click Report pay short and payroll will receive a case.');
    } else if (q.includes('ppe')) {
      setChatAnswer('Minimum PPE for production areas: safety shoes, hair net, gloves where required, ear protection where required, and any machine-specific PPE listed in the SOP.');
    } else if (q.includes('transport')) {
      setChatAnswer('Click I need transport next week. HR or your supervisor will choose pickup, drop off, or both and export the weekly list.');
    } else {
      setChatAnswer('I can help with HR policy, shift times, transport, payslips, incidents, PPE, public holidays, and packing instructions. Sensitive issues should become an HR case.');
    }
  };

  const suspendedWorker = roleView === 'Worker' && actingEmployee.status === 'Suspended';

  const renderWorkerDashboard = () => {
    if (suspendedWorker) {
      return (
        <Paper sx={{ minHeight: 360, display: 'grid', placeItems: 'center', p: 4, bgcolor: '#0f172a', color: '#fff' }}>
          <Box textAlign="center">
            <Security sx={{ fontSize: 48, mb: 2, color: '#ff9800' }} />
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Access suspended
            </Typography>
            <Typography sx={{ opacity: 0.8, mt: 1 }}>This worker sees a blank or blocked-access screen until HR or Admin reactivates the account.</Typography>
          </Box>
        </Paper>
      );
    }

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <SectionCard title="My Profile" subtitle="Worker self-service information">
            <Stack spacing={2} alignItems="center">
              <Avatar src={actingEmployee.profilePhoto} sx={{ width: 88, height: 88, bgcolor: '#1E3C72', fontSize: 28 }}>
                {actingEmployee.name
                  .split(' ')
                  .map(part => part[0])
                  .join('')}
              </Avatar>
              <Button variant="outlined" component="label" startIcon={<UploadFile />}>
                Upload profile photo
                <input hidden accept="image/*" type="file" onChange={handleProfilePhoto} />
              </Button>
              <Box sx={{ width: '100%' }}>
                <Typography fontWeight={800}>{actingEmployee.name}</Typography>
                <Typography color="text.secondary">{actingEmployee.employeeNo}</Typography>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="body2">Phone: {actingEmployee.phone}</Typography>
                <Typography variant="body2">Address: {actingEmployee.address}</Typography>
                <Typography variant="body2">Age: {actingEmployee.age}</Typography>
                <Typography variant="body2">Emergency: {actingEmployee.emergencyName} - {actingEmployee.emergencyPhone}</Typography>
              </Box>
            </Stack>
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <SectionCard title="My Work Today" subtitle="Shift, site, and machine allocation">
            <Stack spacing={1.2}>
              <Chip label={getSiteName(actingEmployee.siteId)} color="primary" />
              <Typography>Shift: {getShift(actingEmployee.shiftId, shiftList)?.name} ({getShift(actingEmployee.shiftId, shiftList)?.hours})</Typography>
              <Typography>Department: {actingEmployee.department}</Typography>
              <Typography>Supervisor: {actingEmployee.supervisor}</Typography>
              <Typography>Machine: {state.machines.find(machine => machine.id === actingEmployee.machineId)?.name || 'Not assigned'}</Typography>
              <Typography>Attendance: {actingEmployee.attendance}</Typography>
              <Typography>Weekly hours: {actingEmployee.weeklyHours}</Typography>
            </Stack>
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <SectionCard title="Payslip and Transport" subtitle="Worker can view and request support">
            <Stack spacing={1.5}>
              <Button variant="contained" startIcon={<PictureAsPdf />}>
                View payslip
              </Button>
              <Button variant="outlined" onClick={() => setChatAnswer('Pay-short case opened. Payroll can review your shift, overtime, and payslip records.')}>
                Report pay is short
              </Button>
              <TextField size="small" label="Transport week" value={transportWeek} onChange={event => setTransportWeek(event.target.value)} />
              <Button variant="contained" color="secondary" startIcon={<DirectionsBus />} onClick={handleTransportRequest}>
                I need transport next week
              </Button>
            </Stack>
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <SectionCard title="Report Incident" subtitle="Capture a photo or upload evidence">
            <Stack spacing={1.5}>
              <TextField
                multiline
                minRows={3}
                label="What happened?"
                value={incidentSummary}
                onChange={event => setIncidentSummary(event.target.value)}
              />
              <Button variant="contained" component="label" startIcon={<HealthAndSafety />}>
                Upload incident photo
                <input hidden accept="image/*" type="file" onChange={handleIncidentPhoto} />
              </Button>
              <Typography variant="body2" color="text.secondary">
                AI can classify urgency and route the report to Safety and the supervisor.
              </Typography>
            </Stack>
          </SectionCard>
        </Grid>

        <Grid item xs={12} md={6}>
          {renderChatbot()}
        </Grid>
      </Grid>
    );
  };

  const renderSupervisorDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={7}>
        <SectionCard title="Shift Attendance" subtitle="Mark absent, present, late, or moved">
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Site</TableCell>
                  <TableCell>Shift</TableCell>
                  <TableCell>Machine</TableCell>
                  <TableCell>Attendance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleEmployees.map(employee => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{getSiteName(employee.siteId)}</TableCell>
                    <TableCell>{getShift(employee.shiftId, shiftList)?.name}</TableCell>
                    <TableCell>{state.machines.find(machine => machine.id === employee.machineId)?.code || 'None'}</TableCell>
                    <TableCell>
                      <Select size="small" value={employee.attendance} onChange={event => handleAttendance(employee.id, event.target.value)}>
                        {['Present', 'Absent', 'Late', 'Moved', 'Pending'].map(status => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </SectionCard>
      </Grid>

      <Grid item xs={12} lg={5}>
        <SectionCard title="Shift Checklist" subtitle="Walk-around PPE and safety checks">
          <Stack spacing={2}>
            {state.shiftChecks
              .filter(check => siteFilter === 'all' || check.siteId === siteFilter)
              .map(check => (
                <Paper key={check.id} sx={{ p: 2, border: '1px solid rgba(15, 23, 42, 0.08)' }}>
                  <Typography fontWeight={800}>
                    {getSiteName(check.siteId)} - {getShift(check.shiftId, shiftList)?.name}
                  </Typography>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography>PPE correct</Typography>
                    <Switch checked={check.ppe} onChange={() => handleChecklistToggle(check.id, 'ppe')} />
                  </Stack>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography>Machines safe</Typography>
                    <Switch checked={check.machinesSafe} onChange={() => handleChecklistToggle(check.id, 'machinesSafe')} />
                  </Stack>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography>Incident on shift</Typography>
                    <Switch checked={check.incidents} onChange={() => handleChecklistToggle(check.id, 'incidents')} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {check.note}
                  </Typography>
                </Paper>
              ))}
          </Stack>
        </SectionCard>
      </Grid>

      <Grid item xs={12}>
        <SectionCard title="Machine Assignment Per Shift" subtitle="Operational machine list and worker assignment">
          {renderMachineTable(true)}
        </SectionCard>
      </Grid>
    </Grid>
  );

  const renderHrDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={7}>
        <SectionCard title="Employees and User Access" subtitle="Approve, suspend, and maintain employee details">
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Site</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Emergency</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleEmployees.map(employee => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar src={employee.profilePhoto} sx={{ width: 32, height: 32 }}>
                          {employee.name[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={800}>
                            {employee.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {employee.employeeNo}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>{getSiteName(employee.siteId)}</TableCell>
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell>{employee.emergencyName} - {employee.emergencyPhone}</TableCell>
                    <TableCell>
                      <Select size="small" value={employee.status} onChange={event => handleUserStatus(employee.id, event.target.value)}>
                        {['Approved', 'Pending approval', 'Suspended'].map(status => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </SectionCard>
      </Grid>

      <Grid item xs={12} lg={5}>
        <SectionCard title="Notifications" subtitle="Send urgent site, shift, or company messages">
          <Stack spacing={2}>
            <TextField
              label="Message"
              value={newNotification}
              onChange={event => setNewNotification(event.target.value)}
              multiline
              minRows={3}
              placeholder="Example: Tomorrow day shift is cancelled because of a water issue."
            />
            <Button variant="contained" startIcon={<NotificationsActive />} onClick={handleSendNotification}>
              Send notification
            </Button>
            <Divider />
            {state.notifications.slice(0, 4).map(notification => (
              <Alert key={notification.id} severity={notification.priority === 'High' ? 'warning' : 'info'}>
                <strong>{notification.audience}:</strong> {notification.message}
              </Alert>
            ))}
          </Stack>
        </SectionCard>
      </Grid>

      <Grid item xs={12} md={6}>
        <SectionCard title="Birthdays" subtitle="Today and upcoming this month">
          <Stack spacing={1}>
            {birthdays.map(employee => (
              <Stack key={employee.id} direction="row" alignItems="center" spacing={1}>
                <Cake color="secondary" />
                <Typography>
                  {employee.name} - {employee.dateOfBirth.slice(5)} ({getSiteName(employee.siteId)})
                </Typography>
              </Stack>
            ))}
          </Stack>
        </SectionCard>
      </Grid>

      <Grid item xs={12} md={6}>
        <SectionCard title="Transport Export" subtitle="Weekly pickup and drop-off list for Excel" action={<Button onClick={exportTransport}>Export Excel CSV</Button>}>
          {renderTransportTable()}
        </SectionCard>
      </Grid>
    </Grid>
  );

  const renderPayrollDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <SectionCard title="Payslip and Pay-Short Cases" subtitle="Payroll can review weekly hours and overtime">
          <Stack spacing={1.2}>
            {state.cases
              .filter(item => item.owner === 'Payroll')
              .map(item => {
                const employee = employees.find(emp => emp.id === item.employeeId);
                return (
                  <Paper key={item.id} sx={{ p: 2 }}>
                    <Typography fontWeight={800}>{employee?.name}</Typography>
                    <Typography>{item.summary}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Hours: {employee?.weeklyHours}, overtime: {employee?.overtimeHours}, status: {item.status}
                    </Typography>
                  </Paper>
                );
              })}
          </Stack>
        </SectionCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <SectionCard title="Weekly Hours By Site" subtitle="Total hours worked this week">
          <Line data={hoursChart} />
        </SectionCard>
      </Grid>
    </Grid>
  );

  const renderSafetyDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={5}>
        <SectionCard title="Incident Severity" subtitle="AI can classify urgency">
          <Doughnut data={incidentChart} />
        </SectionCard>
      </Grid>
      <Grid item xs={12} md={7}>
        <SectionCard title="Incident Queue" subtitle="Photo uploads, anonymous reports, and machine-linked risks">
          <Stack spacing={1.2}>
            {visibleIncidents.map(incident => {
              const employee = employees.find(emp => emp.id === incident.employeeId);
              const machine = state.machines.find(item => item.id === incident.machineId);
              return (
                <Paper key={incident.id} sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" spacing={1}>
                    <Typography fontWeight={800}>
                      {incident.type} - {incident.severity}
                    </Typography>
                    <Chip label={incident.status} color={incident.severity === 'High' ? 'error' : 'warning'} size="small" />
                  </Stack>
                  <Typography>{incident.summary}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {incident.anonymous ? 'Anonymous report' : employee?.name} | {machine?.code} | Photo: {incident.photoName}
                  </Typography>
                </Paper>
              );
            })}
          </Stack>
        </SectionCard>
      </Grid>
    </Grid>
  );

  const renderFactoryManagerDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <SectionCard title="Absenteeism By Site" subtitle="Track site and shift attendance trends">
          <Bar data={absenteeismChart} options={{ scales: { y: { beginAtZero: true, precision: 0 } } }} />
        </SectionCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <SectionCard title="Total Hours By Site" subtitle="Weekly hours worked by all employees">
          <Line data={hoursChart} />
        </SectionCard>
      </Grid>
      <Grid item xs={12}>
        <SectionCard title="Site Trends" subtitle="Five-site operational view">
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Site</TableCell>
                  <TableCell>Headcount</TableCell>
                  <TableCell>Absent</TableCell>
                  <TableCell>Absence rate</TableCell>
                  <TableCell>Total hours</TableCell>
                  <TableCell>Operational machines</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {siteTrendRows.map(row => (
                  <TableRow key={row.site.id}>
                    <TableCell>{row.site.name}</TableCell>
                    <TableCell>{row.headcount}</TableCell>
                    <TableCell>{row.absent}</TableCell>
                    <TableCell>{row.absenceRate}%</TableCell>
                    <TableCell>{row.hours}</TableCell>
                    <TableCell>{row.operational}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </SectionCard>
      </Grid>
    </Grid>
  );

  const renderAdminDashboard = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <SectionCard title="Access Rules" subtitle="Approval, suspension, and role visibility">
          <Stack spacing={1.2}>
            <Alert severity="info">New users must be approved before normal dashboard access.</Alert>
            <Alert severity="warning">Suspended users see a blank or blocked-access screen.</Alert>
            <Alert severity="success">Roles decide whether a user sees worker, supervisor, HR, payroll, safety, factory manager, or admin views.</Alert>
          </Stack>
        </SectionCard>
      </Grid>
      <Grid item xs={12} md={6}>
        <SectionCard title="Offline Queue" subtitle="Local saves waiting for sync">
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              {online ? <CloudDone color="success" /> : <CloudOff color="warning" />}
              <Typography>{online ? 'Online, queue will sync automatically.' : 'Offline mode, actions are saved locally.'}</Typography>
            </Stack>
            {queue.length ? <LinearProgress color="secondary" /> : <LinearProgress variant="determinate" value={100} />}
            {queue.length ? (
              queue.map(item => (
                <Typography key={item.id} variant="body2">
                  {item.label} - saved {item.savedAt}
                </Typography>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No pending offline actions.
              </Typography>
            )}
          </Stack>
        </SectionCard>
      </Grid>
      <Grid item xs={12}>
        <SectionCard title="Operational Machines" subtitle="Full machine module">
          {renderMachineTable(true)}
        </SectionCard>
      </Grid>
    </Grid>
  );

  const renderMachineTable = editable => (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Machine</TableCell>
            <TableCell>Site</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Assigned people</TableCell>
            {editable && <TableCell>Assign worker</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleMachines.map(machine => (
            <TableRow key={machine.id}>
              <TableCell>
                <Typography fontWeight={800}>{machine.code}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {machine.name}
                </Typography>
              </TableCell>
              <TableCell>{getSiteName(machine.siteId)}</TableCell>
              <TableCell>{machine.department}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={machine.status}
                  color={machine.status === 'Operational' ? 'success' : machine.status === 'Maintenance' ? 'warning' : 'error'}
                />
              </TableCell>
              <TableCell>
                {machine.assignedEmployeeIds
                  .map(id => employees.find(employee => employee.id === id)?.name)
                  .filter(Boolean)
                  .join(', ') || 'None'}
              </TableCell>
              {editable && (
                <TableCell>
                  <Select size="small" value="" displayEmpty onChange={event => handleMachineAssign(machine.id, Number(event.target.value))}>
                    <MenuItem value="">Choose</MenuItem>
                    {visibleEmployees
                      .filter(employee => employee.status === 'Approved')
                      .map(employee => (
                        <MenuItem key={employee.id} value={employee.id}>
                          {employee.name}
                        </MenuItem>
                      ))}
                  </Select>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderTransportTable = () => (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Worker</TableCell>
            <TableCell>Week</TableCell>
            <TableCell>Decision</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {state.transportRequests.map(request => {
            const employee = employees.find(item => item.id === request.employeeId);
            return (
              <TableRow key={request.id}>
                <TableCell>{employee?.name}</TableCell>
                <TableCell>{request.week}</TableCell>
                <TableCell>
                  <Select size="small" value={request.direction} onChange={event => handleTransportDecision(request.id, event.target.value)}>
                    {['Needs decision', 'Pickup', 'Drop off', 'Both'].map(direction => (
                      <MenuItem key={direction} value={direction}>
                        {direction}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <Select size="small" value={request.status} onChange={event => handleTransportDecision(request.id, null, event.target.value)}>
                    {['Pending', 'Approved', 'Rejected'].map(status => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderChatbot = () => (
    <SectionCard title="Factory AI Chatbot" subtitle="General HR, shift, public holiday, payslip, PPE, and SOP questions">
      <Stack spacing={1.5}>
        <TextField
          label="Ask a question"
          value={chatQuestion}
          onChange={event => setChatQuestion(event.target.value)}
          placeholder="What time do I start tomorrow?"
        />
        <Button variant="contained" startIcon={<Psychology />} onClick={askChatbot}>
          Ask chatbot
        </Button>
        <Alert severity="info">{chatAnswer}</Alert>
      </Stack>
    </SectionCard>
  );

  const tabContent = [
    renderWorkerDashboard,
    renderSupervisorDashboard,
    renderHrDashboard,
    renderPayrollDashboard,
    renderSafetyDashboard,
    renderFactoryManagerDashboard,
    renderAdminDashboard,
  ];

  return (
    <Box sx={{ mt: 2 }}>
      <Box
        sx={{
          borderRadius: 3,
          p: { xs: 2, md: 3 },
          mb: 3,
          background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
          color: 'white',
          boxShadow: 4,
        }}
      >
        <Stack direction={{ xs: 'column', lg: 'row' }} justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              Factory Work App
            </Typography>
            <Typography sx={{ opacity: 0.9, maxWidth: 760 }}>
              Welcome, {username}. Manage workers, sites, shifts, machines, transport, incidents, payslips, notifications, and offline sync from one place.
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <Chip icon={online ? <CloudDone /> : <CloudOff />} label={online ? 'Online' : 'Offline capture'} color={online ? 'success' : 'warning'} />
            <Chip
              label={lastSync ? `${syncStatus} (${lastSync})` : syncStatus}
              color={syncStatus.includes('failed') || syncStatus.includes('local') || syncStatus.includes('Offline') ? 'warning' : 'info'}
              sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: '#fff', maxWidth: { xs: '100%', sm: 320 }, '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' } }}
            />
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2">Simulate offline</Typography>
              <Switch checked={offlineMode} onChange={event => setOfflineMode(event.target.checked)} />
            </Stack>
          </Stack>
        </Stack>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Site view</InputLabel>
            <Select label="Site view" value={siteFilter} onChange={event => setSiteFilter(event.target.value)}>
              {sites.map(site => (
                <MenuItem key={site.id} value={site.id}>
                  {site.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Role view</InputLabel>
            <Select label="Role view" value={roleView} onChange={event => setRoleView(event.target.value)}>
              {roleOptions.map(role => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Acting worker</InputLabel>
            <Select label="Acting worker" value={actingEmployeeId} onChange={event => setActingEmployeeId(Number(event.target.value))}>
              {employees.map(employee => (
                <MenuItem key={employee.id} value={employee.id}>
                  {employee.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button fullWidth variant="outlined" onClick={() => updateState('Factory demo data reset', () => initialState)}>
            Reset demo data
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Approved users" value={metrics.approved} helper={`${metrics.pending} pending, ${metrics.suspended} suspended`} icon={<Badge />} gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Absent today" value={metrics.absent} helper="Tracked by site, shift, and supervisor" icon={<PersonOff />} gradient="linear-gradient(135deg, #f6d365 0%, #fda085 100%)" darkText />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Weekly hours" value={metrics.weeklyHours} helper={`${metrics.overtime} overtime hours logged`} icon={<AccessTime />} gradient="linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)" darkText />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Operational machines" value={metrics.operationalMachines} helper={`${metrics.openIncidents} open incidents`} icon={<Engineering />} gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" />
        </Grid>
      </Grid>

      <Paper sx={{ mb: 3, overflow: 'hidden' }}>
        <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)} variant="scrollable" scrollButtons="auto">
          <Tab icon={<Badge />} iconPosition="start" label="Worker" />
          <Tab icon={<FactCheck />} iconPosition="start" label="Supervisor" />
          <Tab icon={<Cake />} iconPosition="start" label="HR" />
          <Tab icon={<PictureAsPdf />} iconPosition="start" label="Payroll" />
          <Tab icon={<HealthAndSafety />} iconPosition="start" label="Safety" />
          <Tab icon={<Engineering />} iconPosition="start" label="Factory Manager" />
          <Tab icon={<Security />} iconPosition="start" label="Admin/IT" />
        </Tabs>
      </Paper>

      {tabContent[activeTab]()}
    </Box>
  );
};

export default Dashboard;
