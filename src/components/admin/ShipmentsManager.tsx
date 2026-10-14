import React, { useState } from 'react';
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  Printer,
  ArrowLeft,
  Filter,
  Package,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Shipment, ShipmentStatus, TransportMode } from '../../types';
import { StatusBadge, ModeIcon, MODE_LABELS, formatDate, CopyButton } from '../common';
import { AdminTab } from './AdminLayout';

interface ShipmentsManagerProps {
  onSelectTab: (tab: AdminTab, shipmentId?: string) => void;
  onOpenWaybill: (shipment: Shipment) => void;
}

export const ShipmentsManager: React.FC<ShipmentsManagerProps> = ({
  onSelectTab,
  onOpenWaybill,
}) => {
  const { shipments, deleteShipment } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modeFilter, setModeFilter] = useState<string>('all');
  const [shipmentToDelete, setShipmentToDelete] = useState<Shipment | null>(null);

  const filteredShipments = shipments.filter((shp) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      shp.trackingNumber.toLowerCase().includes(q) ||
      shp.customerName.toLowerCase().includes(q) ||
      shp.origin.toLowerCase().includes(q) ||
      shp.destination.toLowerCase().includes(q) ||
      shp.cargo.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || shp.status === statusFilter;
    const matchesMode = modeFilter === 'all' || shp.mode === modeFilter;

    return matchesSearch && matchesStatus && matchesMode;
  });

  const confirmDelete = () => {
    if (shipmentToDelete) {
      deleteShipment(shipmentToDelete.id);
      setShipmentToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#102b3b]">إدارة الشحنات</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            متابعة حركة الشحنات، تحديث مراحل الوصول، وطباعة بوالص الشحن.
          </p>
        </div>

        <button
          onClick={() => onSelectTab('shipment-new')}
          className="bg-[#db8c42] hover:bg-[#b96b25] text-slate-900 font-bold px-4 py-2.5 rounded text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
        >
          <PlusCircle size={17} />
          <span>إضافة شحنة جديدة</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#e6eaeb] shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[220px] relative flex items-center">
          <Search size={16} className="absolute right-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="البحث برقم التتبع، العميل، أو المسار…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#f6f4ef] border border-[#e6eaeb] focus:border-amber-500 focus:bg-white rounded px-3.5 pr-10 py-2 text-xs sm:text-sm outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#f6f4ef] border border-[#e6eaeb] rounded px-3 py-2 text-xs text-slate-700 outline-none cursor-pointer"
          >
            <option value="all">كل الحالات</option>
            <option value="received">تم الاستلام</option>
            <option value="processing">قيد التجهيز</option>
            <option value="in_transit">في الطريق</option>
            <option value="customs">التخليص الجمركي</option>
            <option value="delivered">تم التسليم</option>
          </select>

          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="bg-[#f6f4ef] border border-[#e6eaeb] rounded px-3 py-2 text-xs text-slate-700 outline-none cursor-pointer"
          >
            <option value="all">كل الوسائل</option>
            <option value="sea">بحري</option>
            <option value="air">جوي</option>
            <option value="land">بري</option>
          </select>
        </div>
      </div>

      {/* Shipments Table / Cards */}
      <div className="bg-white rounded-xl border border-[#e6eaeb] shadow-xs overflow-hidden">
        {filteredShipments.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Package size={38} className="mx-auto mb-3 text-slate-300" />
            <h3 className="text-base font-semibold text-slate-700 mb-1">لا توجد شحنات مطابقة</h3>
            <p className="text-xs">جرب تغيير كلمات البحث أو إعادة ضبط خيارات التصفية.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#f6f4ef] text-slate-500 font-semibold border-b border-[#e6eaeb]">
                <tr>
                  <th className="p-4">رقم التتبع والوسيلة</th>
                  <th className="p-4">المسار (من / إلى)</th>
                  <th className="p-4">بيانات العميل</th>
                  <th className="p-4">الحالة</th>
                  <th className="p-4">الوصول المتوقع</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e6eaeb]">
                {filteredShipments.map((shp) => (
                  <tr key={shp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded bg-slate-100 text-slate-700">
                          <ModeIcon mode={shp.mode} size={15} />
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <strong dir="ltr" className="font-manrope text-xs font-bold text-slate-900">
                              {shp.trackingNumber}
                            </strong>
                            <CopyButton value={shp.trackingNumber} />
                          </div>
                          <span className="text-[10px] text-slate-400">
                            الشحن {MODE_LABELS[shp.mode]}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 max-w-xs">
                      <div className="flex items-center gap-1 font-semibold text-slate-800">
                        <span className="truncate">{shp.origin}</span>
                        <ArrowLeft size={11} className="text-slate-400 shrink-0" />
                        <span className="truncate">{shp.destination}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5" title={shp.cargo}>
                        {shp.cargo}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{shp.customerName}</div>
                      <div dir="ltr" className="font-manrope text-[11px] text-slate-500 text-right">
                        {shp.customerPhone}
                      </div>
                    </td>

                    <td className="p-4">
                      <StatusBadge status={shp.status} />
                    </td>

                    <td className="p-4 font-semibold text-slate-700">
                      {formatDate(shp.eta)}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onSelectTab('shipment-edit', shp.id)}
                          className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                          title="تعديل وتحديث السجل"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => onOpenWaybill(shp)}
                          className="p-1.5 rounded hover:bg-amber-100 text-amber-700 transition-colors cursor-pointer"
                          title="طباعة بوليصة الشحن"
                        >
                          <Printer size={15} />
                        </button>
                        <button
                          onClick={() => setShipmentToDelete(shp)}
                          className="p-1.5 rounded hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                          title="حذف الشحنة"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {shipmentToDelete && (
        <div className="modal-backdrop fixed inset-0 z-50 bg-[#102b3b]/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">تأكيد حذف الشحنة</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              هل أنت متأكد من حذف الشحنة رقم{' '}
              <strong dir="ltr" className="font-manrope font-bold text-amber-800">
                {shipmentToDelete.trackingNumber}
              </strong>
              ؟ سيتم حذف جميع مراحل السجل ولا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShipmentToDelete(null)}
                className="px-4 py-2 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded text-xs font-bold bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
