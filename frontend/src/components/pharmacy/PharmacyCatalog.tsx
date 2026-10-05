// =================================================================
// CarePoint Health System — Digital Pharmacy & Prescription Catalog
// Medical Product Cards · Stock Availability · Express Dispatch
// =================================================================

import React, { useState, useMemo } from 'react';
import {
  Pill,
  Search,
  CheckCircle2,
  AlertTriangle,
  ShoppingBag,
  ShieldCheck,
  Tag,
  Sparkles,
  ArrowRight,
  Filter,
  X
} from 'lucide-react';
import { Medicine } from '../../types';
import { MedicalNetworkBackground } from '../common/MedicalNetworkBackground';

interface PharmacyCatalogProps {
  medicines: Medicine[];
  onOrderMedicine?: (medicine: Medicine) => void;
}

export const PharmacyCatalog: React.FC<PharmacyCatalogProps> = ({
  medicines,
  onOrderMedicine
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [orderedItem, setOrderedItem] = useState<Medicine | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    medicines.forEach(m => {
      if (m.Category) set.add(m.Category);
    });
    return Array.from(set);
  }, [medicines]);

  // Filtered medicines
  const filtered = useMemo(() => {
    return medicines.filter(m => {
      const matchesSearch =
        m.MedicineName.toLowerCase().includes(search.toLowerCase()) ||
        (m.Category && m.Category.toLowerCase().includes(search.toLowerCase())) ||
        (m.Description && m.Description.toLowerCase().includes(search.toLowerCase()));

      const matchesCat =
        selectedCategory === 'all' ||
        (m.Category && m.Category.toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesCat;
    });
  }, [medicines, search, selectedCategory]);

  const handleOrder = (m: Medicine) => {
    setOrderedItem(m);
    if (onOrderMedicine) onOrderMedicine(m);
  };

  return (
    <section style={{ padding: '48px 0 80px 0', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle molecular network background */}
      <MedicalNetworkBackground
        variant="subtle"
        density="low"
        opacity={0.16}
        style={{ zIndex: 0 }}
      />

      <div className="app-container-wide" style={{ position: 'relative', zIndex: 10 }}>
        {/* ── Section Header (Solid Opaque Banner Box) ────────────────── */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #DCD7CD',
            boxShadow: '0 12px 36px rgba(22, 74, 65, 0.09), 0 2px 8px rgba(22, 74, 65, 0.03)',
            padding: 'clamp(24px, 3.5vw, 36px)',
            marginBottom: '32px',
            position: 'relative',
            zIndex: 30
          }}
        >
          <span className="badge badge-forest" style={{ marginBottom: '10px' }}>
            Hospital In-House Dispensary
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', color: '#164A41', lineHeight: 1.15, margin: '0 0 8px 0' }}>
            Digital Pharmacy & Therapeutics
          </h1>
          <p style={{ color: '#5F6E68', fontSize: '0.96rem', margin: 0, maxWidth: '680px' }}>
            Access authentic physician-approved pharmaceuticals, prescription refills, and verified therapeutic formulations with cold-chain verified delivery.
          </p>
        </div>

        {/* ── Search & Filter Bar ─────────────────────────────────── */}
        <div
          className="solid-card"
          style={{
            padding: '20px 24px',
            marginBottom: '32px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 280px', minWidth: '240px' }}>
            <Search
              size={18}
              color="#8A9993"
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search medications, therapeutic classes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '42px' }}
            />
          </div>

          {/* Category Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#5F6E68' }}>
              Category:
            </span>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="form-select"
              style={{ width: 'auto', minWidth: '180px' }}
            >
              <option value="all">All Drug Classes</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Product Cards Grid ──────────────────────────────────── */}
        <div className="grid-cols-3">
          {filtered.map(med => (
            <div
              key={med.MedicineID}
              className="solid-card"
              style={{
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '320px'
              }}
            >
              <div>
                {/* Card Top: Category Badge & Stock */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
                    {med.Category || 'Pharmaceutical'}
                  </span>

                  <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                    In Stock ({med.StockQuantity || 240} units)
                  </span>
                </div>

                {/* Medicine Title & Icon */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: '#FAF8F4',
                      border: '1px solid #E5E0D6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Pill size={22} color="#164A41" />
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: '#17201D', lineHeight: 1.25 }}>
                      {med.MedicineName}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: '#8A9993', marginTop: '2px' }}>
                      Mfg: {med.Manufacturer || 'Aegis Healthcare Labs'}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.86rem', color: '#5F6E68', lineHeight: 1.55, marginBottom: '18px' }}>
                  {med.Description || 'Standard physician-prescribed therapeutic for clinical condition management.'}
                </p>
              </div>

              {/* Card Bottom: Unit Price & Dispense Button */}
              <div
                style={{
                  paddingTop: '16px',
                  borderTop: '1px solid #EFECE6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#8A9993', textTransform: 'uppercase', fontWeight: 700 }}>
                    Unit Price
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#164A41' }}>
                    ${med.UnitPrice.toFixed(2)}
                  </div>
                </div>

                <button
                  onClick={() => handleOrder(med)}
                  className="btn btn-primary btn-sm"
                >
                  <ShoppingBag size={14} />
                  <span>Request Dispense</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Order Success Modal ─────────────────────────────────── */}
        {orderedItem && (
          <div className="modal-backdrop" onClick={() => setOrderedItem(null)}>
            <div className="modal-dialog" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="badge badge-success" style={{ marginBottom: '4px' }}>
                    Rx Dispense Order
                  </span>
                  <h3 style={{ fontSize: '1.3rem', color: '#164A41' }}>
                    Medicine Request Confirmed
                  </h3>
                </div>
                <button
                  onClick={() => setOrderedItem(null)}
                  style={{ background: 'none', border: 'none', color: '#5F6E68', cursor: 'pointer', padding: '6px' }}
                >
                  <X size={22} />
                </button>
              </div>

              <div className="modal-body" style={{ textAlign: 'center', padding: '24px' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#EBF6F0',
                    color: '#2E7D52',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px auto'
                  }}
                >
                  <CheckCircle2 size={32} />
                </div>

                <h4 style={{ fontSize: '1.2rem', color: '#17201D', marginBottom: '8px' }}>
                  {orderedItem.MedicineName}
                </h4>
                <p style={{ color: '#5F6E68', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Your prescription dispense request has been logged. Our hospital pharmacy team will verify prescription records and prepare the medication pack.
                </p>

                <div style={{ backgroundColor: '#FAF8F4', border: '1px solid #E5E0D6', borderRadius: '12px', padding: '14px', fontSize: '0.85rem', color: '#164A41', fontWeight: 600 }}>
                  Unit Price: ${orderedItem.UnitPrice.toFixed(2)} · In-Clinic Pick-up & Express Delivery Active
                </div>
              </div>

              <div className="modal-footer">
                <button onClick={() => setOrderedItem(null)} className="btn btn-primary">
                  <span>Close Window</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
