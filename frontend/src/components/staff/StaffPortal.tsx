// =================================================================
// CarePoint Health System — Hospital Operations Center (Staff Portal)
// Dedicated Command Center · Operations KPIs · Full 15-Module CRUD Management
// =================================================================

import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Users,
  UserCheck,
  Building2,
  Calendar,
  FileText,
  Pill,
  DollarSign,
  Bed,
  Plus,
  Search,
  Edit2,
  Trash2,
  ArrowLeft,
  RefreshCw,
  X,
  CheckCircle2,
  Activity,
  Layers,
  CreditCard,
  Briefcase
} from 'lucide-react';
import { api } from '../../services/api';
import { StorageData } from '../../services/storage';

interface StaffPortalProps {
  data: StorageData;
  onRefreshData: () => void;
  onExitStaffPortal: () => void;
}

type ModuleKey =
  | 'patient'
  | 'doctor'
  | 'department'
  | 'appointment'
  | 'medhistory'
  | 'prescription'
  | 'medicine'
  | 'service'
  | 'bill'
  | 'payment'
  | 'floorward'
  | 'room';

export const StaffPortal: React.FC<StaffPortalProps> = ({
  data,
  onRefreshData,
  onExitStaffPortal
}) => {
  const [activeModule, setActiveModule] = useState<ModuleKey>('patient');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const modules: { id: ModuleKey; label: string; icon: React.ReactNode; group: string }[] = [
    { id: 'patient', label: 'Patients', icon: <Users size={16} />, group: 'People & Faculty' },
    { id: 'doctor', label: 'Doctors', icon: <UserCheck size={16} />, group: 'People & Faculty' },
    { id: 'department', label: 'Departments', icon: <Building2 size={16} />, group: 'People & Faculty' },
    { id: 'appointment', label: 'Appointments', icon: <Calendar size={16} />, group: 'Clinical Operations' },
    { id: 'medhistory', label: 'Medical History', icon: <FileText size={16} />, group: 'Clinical Operations' },
    { id: 'prescription', label: 'Prescriptions', icon: <Pill size={16} />, group: 'Clinical Operations' },
    { id: 'medicine', label: 'Medicines Inventory', icon: <Pill size={16} />, group: 'Pharmacy & Stock' },
    { id: 'service', label: 'Clinical Services', icon: <Briefcase size={16} />, group: 'Billing & Tariffs' },
    { id: 'bill', label: 'Invoices & Bills', icon: <DollarSign size={16} />, group: 'Billing & Tariffs' },
    { id: 'payment', label: 'Payments Received', icon: <CreditCard size={16} />, group: 'Billing & Tariffs' },
    { id: 'floorward', label: 'Floors & Wards', icon: <Layers size={16} />, group: 'Infrastructure' },
    { id: 'room', label: 'Rooms & Beds', icon: <Bed size={16} />, group: 'Infrastructure' }
  ];

  // Entity primary key resolver
  const getPk = (key: ModuleKey) => {
    const pkMap: Record<ModuleKey, string> = {
      patient: 'PatientID',
      doctor: 'DoctorID',
      department: 'DepartmentID',
      appointment: 'AppointmentID',
      medhistory: 'HistoryID',
      prescription: 'PrescriptionID',
      medicine: 'MedicineID',
      service: 'ServiceID',
      bill: 'BillID',
      payment: 'PaymentID',
      floorward: 'FloorWardID',
      room: 'RoomID'
    };
    return pkMap[key];
  };

  // Active items list with search filter
  const currentList = useMemo(() => {
    const rawList = (data as any)[activeModule] || [];
    if (!searchQuery.trim()) return rawList;

    const q = searchQuery.toLowerCase();
    return rawList.filter((item: any) => {
      return Object.values(item).some(val =>
        String(val || '').toLowerCase().includes(q)
      );
    });
  }, [data, activeModule, searchQuery]);

  // Operations KPI Metrics
  const totalPatients = data.patient.length;
  const totalDoctors = data.doctor.length;
  const totalAppointments = data.appointment.length;
  const scheduledAppointments = data.appointment.filter(a => a.Status === 'Scheduled').length;
  const totalBeds = data.room.reduce((acc, r) => acc + (Number(r.BedCount) || 1), 0);
  const availableRooms = data.room.filter(r => r.OccupancyStatus === 'Available').length;
  const totalRevenue = data.payment.reduce((acc, p) => acc + (Number(p.AmountPaid) || 0), 0);

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Delete Handler
  const handleDelete = async (item: any) => {
    const pk = getPk(activeModule);
    const id = item[pk];
    if (window.confirm(`Are you sure you want to remove this ${activeModule} record (#${id})?`)) {
      await api.deleteEntity(activeModule, id);
      onRefreshData();
      showNotification(`Record #${id} deleted successfully.`);
    }
  };

  // Save Modal Form Handler
  const handleSaveModal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const itemPayload: Record<string, any> = {};

    formData.forEach((value, key) => {
      itemPayload[key] = value;
    });

    try {
      if (editingItem) {
        const pk = getPk(activeModule);
        itemPayload[pk] = editingItem[pk];
        // update
        await api.createEntity(activeModule, itemPayload);
        showNotification(`Record #${editingItem[pk]} updated successfully.`);
      } else {
        // create new
        await api.createEntity(activeModule, itemPayload);
        showNotification(`New ${activeModule} record created.`);
      }
      onRefreshData();
      setIsNewModalOpen(false);
      setEditingItem(null);
    } catch (err: any) {
      alert('Save operation failed: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#F8F6F0', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* ── Top Operations Center Header ────────────────────────── */}
      <header
        style={{
          backgroundColor: '#164A41',
          color: '#FFFFFF',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 800
        }}
      >
        <div
          className="app-container-wide"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShieldCheck size={24} color="#164A41" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
                CarePoint Operations Center
              </div>
              <div style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Hospital Clinical ERP & Administration
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '9999px',
                padding: '4px 12px',
                fontSize: '0.75rem',
                color: '#FFFFFF'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3D8B68' }} />
              {api.isBackendOnline ? 'Express / MySQL Live' : 'Local Storage Cache Online'}
            </div>

            <button
              onClick={onRefreshData}
              className="btn btn-outline btn-sm"
              style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              <RefreshCw size={14} />
              <span>Sync</span>
            </button>

            <button
              onClick={onExitStaffPortal}
              className="btn btn-accent btn-sm"
            >
              <ArrowLeft size={14} />
              <span>Back to Patient Website</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Operational Notification Banner ─────────────────────── */}
      {actionNotice && (
        <div
          style={{
            backgroundColor: '#E7F3F0',
            borderBottom: '1px solid #164A41',
            color: '#164A41',
            padding: '10px 24px',
            fontSize: '0.88rem',
            fontWeight: 600,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <CheckCircle2 size={16} color="#164A41" />
          <span>{actionNotice}</span>
        </div>
      )}

      <div className="app-container-wide" style={{ paddingTop: '28px' }}>
        {/* ── Hospital KPI Metric Cards ────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '14px',
            marginBottom: '28px'
          }}
        >
          <div className="solid-card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.72rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
              Registered Patients
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#164A41', marginTop: '2px' }}>
              {totalPatients}
            </div>
          </div>

          <div className="solid-card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.72rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
              Active Faculty Doctors
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#164A41', marginTop: '2px' }}>
              {totalDoctors}
            </div>
          </div>

          <div className="solid-card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.72rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
              Pending Appointments
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#E8795B', marginTop: '2px' }}>
              {scheduledAppointments}
            </div>
          </div>

          <div className="solid-card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.72rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
              Total Facility Beds
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2F7D6D', marginTop: '2px' }}>
              {totalBeds}
            </div>
          </div>

          <div className="solid-card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.72rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
              Available Suites/Rooms
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2E7D52', marginTop: '2px' }}>
              {availableRooms}
            </div>
          </div>

          <div className="solid-card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.72rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
              Processed Receipts
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#164A41', marginTop: '2px' }}>
              ₹{totalRevenue.toFixed(0)}
            </div>
          </div>
        </div>

        {/* ── Main Operations Layout (Sidebar + Data Workspace) ────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '260px 1fr',
            gap: '24px',
            alignItems: 'start'
          }}
          className="staff-grid-layout"
        >
          {/* Module Navigation Sidebar */}
          <div
            className="solid-card"
            style={{
              padding: '16px',
              backgroundColor: '#FFFFFF'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8A9993', textTransform: 'uppercase', padding: '8px 12px' }}>
              Clinical & Admin Modules
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {modules.map(mod => {
                const isActive = activeModule === mod.id;
                const count = Array.isArray((data as any)[mod.id]) ? (data as any)[mod.id].length : 0;

                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      setActiveModule(mod.id);
                      setSearchQuery('');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      fontSize: '0.86rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#164A41' : '#323F3B',
                      backgroundColor: isActive ? '#E7F3F0' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: isActive ? '#164A41' : '#5F6E68' }}>{mod.icon}</span>
                      {mod.label}
                    </span>
                    <span
                      style={{
                        backgroundColor: isActive ? '#164A41' : '#FAF8F4',
                        color: isActive ? '#FFFFFF' : '#8A9993',
                        padding: '2px 7px',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Data Workspace Table */}
          <div className="solid-card" style={{ padding: '24px' }}>
            {/* Table Header & Controls */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                marginBottom: '20px'
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.35rem', color: '#164A41', textTransform: 'capitalize' }}>
                  {modules.find(m => m.id === activeModule)?.label} Management
                </h2>
                <div style={{ fontSize: '0.8rem', color: '#5F6E68' }}>
                  Total records: {currentList.length}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative', width: '220px' }}>
                  <Search
                    size={15}
                    color="#8A9993"
                    style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="text"
                    placeholder="Search table..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="form-input"
                    style={{ padding: '7px 10px 7px 32px', fontSize: '0.82rem' }}
                  />
                </div>

                <button
                  onClick={() => {
                    setEditingItem(null);
                    setIsNewModalOpen(true);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={14} />
                  <span>Add Record</span>
                </button>
              </div>
            </div>

            {/* Dynamic Data Table */}
            {currentList.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: '#5F6E68', backgroundColor: '#FAF8F4', borderRadius: '12px' }}>
                No records found for this module or query.
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      {Object.keys(currentList[0] || {}).map(col => (
                        <th key={col}>{col}</th>
                      ))}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentList.map((item: any, idx: number) => {
                      const pk = getPk(activeModule);
                      const id = item[pk] || idx;

                      return (
                        <tr key={id}>
                          {Object.keys(currentList[0] || {}).map(col => (
                            <td key={col} style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {typeof item[col] === 'boolean'
                                ? (item[col] ? 'Yes' : 'No')
                                : String(item[col] ?? '')}
                            </td>
                          ))}
                          <td style={{ whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                onClick={() => {
                                  setEditingItem(item);
                                  setIsNewModalOpen(true);
                                }}
                                style={{
                                  background: 'none',
                                  border: '1px solid #E5E0D6',
                                  borderRadius: '6px',
                                  padding: '4px 8px',
                                  color: '#164A41',
                                  cursor: 'pointer'
                                }}
                                title="Edit"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDelete(item)}
                                style={{
                                  background: 'none',
                                  border: '1px solid #E5E0D6',
                                  borderRadius: '6px',
                                  padding: '4px 8px',
                                  color: '#C04343',
                                  cursor: 'pointer'
                                }}
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Add / Edit Entity Modal ───────────────────────────────── */}
      {isNewModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsNewModalOpen(false)}>
          <div
            className="modal-dialog modal-dialog-wide"
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="badge badge-forest" style={{ marginBottom: '4px' }}>
                  {editingItem ? 'Edit Record' : 'New Entry'}
                </span>
                <h3 style={{ fontSize: '1.3rem', color: '#164A41', textTransform: 'capitalize' }}>
                  {activeModule} Form
                </h3>
              </div>

              <button
                onClick={() => setIsNewModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#5F6E68', cursor: 'pointer', padding: '6px' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  {/* Dynamic Form Generation from entity sample properties */}
                  {Object.keys(currentList[0] || {}).map(field => {
                    const pk = getPk(activeModule);
                    if (field === pk) return null; // Auto generated

                    const defaultValue = editingItem ? editingItem[field] : '';

                    return (
                      <div key={field} className="form-group">
                        <label className="form-label" style={{ fontSize: '0.82rem' }}>
                          {field}:
                        </label>
                        <input
                          type="text"
                          name={field}
                          defaultValue={defaultValue}
                          className="form-input"
                          style={{ padding: '9px 12px', fontSize: '0.88rem' }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn btn-primary"
                >
                  {isSaving ? <span>Saving...</span> : <span>Save Record</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Embedded CSS for layout responsiveness */}
      <style>{`
        @media (max-width: 900px) {
          .staff-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
