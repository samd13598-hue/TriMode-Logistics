import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  RefreshCw,
  Printer,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Check,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Shipment, TransportMode, ShipmentStatus, ShipmentEvent } from '../../types';
import { ModeIcon, MODE_LABELS, SHIPMENT_STATUS_LABELS, StatusBadge, formatDate } from '../common';
import { AdminTab } from './AdminLayout';

interface ShipmentEditorProps {
  shipmentId?: string;
  onSelectTab: (tab: AdminTab, shipmentId?: string) => void;
  onOpenWaybill: (shipment: Shipment) => void;
}

export const ShipmentEditor: React.FC<ShipmentEditorProps> = ({
  shipmentId,
  onSelectTab,
  onOpenWaybill,
}) => {
  const { shipments, addShipment, updateShipment, addShipmentEvent, deleteShipmentEvent } =
    useStore();

  const isEditing = Boolean(shipmentId);
  const existingShipment = shipments.find((s) => s.id === shipmentId);

  const generateTrackingNumber = () => {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `TM-${random}`;
  };

  const [trackingNumber, setTrackingNumber] = useState(
    existingShipment?.trackingNumber || generateTrackingNumber()
  );
  const [mode, setMode] = useState<TransportMode>(existingShipment?.mode || 'sea');
  const [status, setStatus] = useState<ShipmentStatus>(existingShipment?.status || 'received');
  const [origin, setOrigin] = useState(existingShipment?.origin || '');
  const [destination, setDestination] = useState(existingShipment?.destination || 'صنعاء، اليمن');
  const [cargo, setCargo] = useState(existingShipment?.cargo || '');
  const [eta, setEta] = useState(
    existingShipment?.eta || new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0]
  );
  const [customerName, setCustomerName] = useState(existingShipment?.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(existingShipment?.customerPhone || '+967 ');
  const [internalNotes, setInternalNotes] = useState(existingShipment?.internalNotes || '');

  // New Milestone event form
  const [newEventMsg, setNewEventMsg] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventDate, setNewEventDate] = useState(new Date().toISOString().slice(0, 16));

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingShipment) {
      setTrackingNumber(existingShipment.trackingNumber);
      setMode(existingShipment.mode);
      setStatus(existingShipment.status);
      setOrigin(existingShipment.origin);
      setDestination(existingShipment.destination);
      setCargo(existingShipment.cargo);
      setEta(existingShipment.eta);
      setCustomerName(existingShipment.customerName);
      setCustomerPhone(existingShipment.customerPhone);
      setInternalNotes(existingShipment.internalNotes || '');
    }
  }, [existingShipment]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim() || !origin.trim() || !destination.trim() || !cargo.trim()) {
      setError('يرجى ملء جميع الحقول الإلزامية.');
      return;
    }

    setError('');

    if (isEditing && shipmentId) {
      updateShipment(shipmentId, {
        trackingNumber: trackingNumber.trim().toUpperCase(),
        mode,
        status,
        origin: origin.trim(),
        destination: destination.trim(),
        cargo: cargo.trim(),
        eta,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        internalNotes: internalNotes.trim(),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      const initialEvents: ShipmentEvent[] = [
        {
          id: 'ev-' + Date.now().toString(36),
          message: 'تم تسجيل الشحنة وإنشاء بوليصة التتبع',
          location: origin.trim(),
          occurredAt: new Date().toISOString(),
        },
      ];

      const created = addShipment({
        trackingNumber: trackingNumber.trim().toUpperCase(),
        mode,
        status,
        origin: origin.trim(),
        destination: destination.trim(),
        cargo: cargo.trim(),
        eta,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        internalNotes: internalNotes.trim(),
        events: initialEvents,
      });

      onSelectTab('shipment-edit', created.id);
    }
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!existingShipment || !newEventMsg.trim() || !newEventLocation.trim()) return;

    addShipmentEvent(existingShipment.id, {
      message: newEventMsg.trim(),
      location: newEventLocation.trim(),
      occurredAt: new Date(newEventDate).toISOString(),
    });

    setNewEventMsg('');
    setNewEventLocation('');
    setNewEventDate(new Date().toISOString().slice(0, 16));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('shipments')}
            className="p-2 rounded bg-white border border-[#e6eaeb] hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
            title="رجوع للقائمة"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#102b3b]">
              {isEditing ? `تعديل الشحنة ${trackingNumber}` : 'إضافة شحنة جديدة'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              تحديث البيانات وتسجيل مراحل رحلة الشحنة لظهورها في صفحة التتبع للعميل.
            </p>
          </div>
        </div>

        {isEditing && existingShipment && (
          <button
            type="button"
            onClick={() => onOpenWaybill(existingShipment)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4 py-2 rounded text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer size={15} className="text-amber-600" />
            <span>معاينة وطباعة البوليصة</span>
          </button>
        )}
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg text-xs flex items-center gap-2">
          <Check size={16} className="text-emerald-600" />
          <span>تم حفظ بيانات الشحنة بنجاح!</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#e6eaeb] shadow-xs">
          <h2 className="text-base font-bold text-[#102b3b] mb-4 pb-2 border-b border-[#e6eaeb]">
            البيانات الأساسية للشحنة
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {/* Tracking Number */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">رقم التتبع / البوليصة</label>
                <button
                  type="button"
                  onClick={() => setTrackingNumber(generateTrackingNumber())}
                  className="text-[10px] text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={11} />
                  <span>توليد تلقائي</span>
                </button>
              </div>
              <input
                type="text"
                dir="ltr"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                required
                className="w-full bg-[#f6f4ef] border border-[#e6eaeb] focus:border-amber-500 focus:bg-white rounded px-3 py-2 text-xs sm:text-sm font-manrope font-bold uppercase tracking-wider outline-none"
              />
            </div>

            {/* Transport Mode */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">وسيلة الشحن</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as TransportMode)}
                className="w-full bg-[#f6f4ef] border border-[#e6eaeb] focus:border-amber-500 focus:bg-white rounded px-3 py-2 text-xs sm:text-sm outline-none cursor-pointer"
              >
                <option value="sea">بحري (حاويات وشحن جزئي)</option>
                <option value="air">جوي (شحن سريع وعاجل)</option>
                <option value="land">بري (قاطرات ونقل إقليمي)</option>
              </select>
            </div>

            {/* Current Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">الحالة الحالية</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ShipmentStatus)}
                className="w-full bg-[#f6f4ef] border border-[#e6eaeb] focus:border-amber-500 focus:bg-white rounded px-3 py-2 text-xs sm:text-sm outline-none cursor-pointer"
              >
                <option value="received">تم الاستلام</option>
                <option value="processing">قيد التجهيز</option>
                <option value="in_transit">في الطريق</option>
                <option value="customs">التخليص الجمركي</option>
                <option value="delivered">تم التسليم</option>
              </select>
            </div>

            {/* Origin */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">من (المصدر)</label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="مثال: ميناء نينغبو، الصين"
                required
                className="w-full bg-[#f6f4ef] border border-[#e6eaeb] focus:border-amber-500 focus:bg-white rounded px-3 py-2 text-xs sm:text-sm outline-none"
              />
            </div>

            {/* Destination */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">إلى (الوجهة)</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="مثال: صنعاء، اليمن"
                required
                className="w-full bg-[#f6f4ef] border border-[#e6eaeb] focus:border-amber-500 focus:bg-white rounded px-3 py-2 text-xs sm:text-sm outline-none"
              />
            </div>

            {/* ETA */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">تاريخ الوصول المتوقع (ETA)</label>
              <input
                type="date"
                dir="ltr"
                value={eta}
                onChange={(e) => setEta(e.target.value)}
                required
                className="w-full bg-[#f6f4ef] border border-[#e6eaeb] focus:border-amber-500 focus:bg-white rounded px-3 py-2 text-xs sm:text-sm font-manrope outline-none"
              />
            </div>

            {/* Cargo description */}
            <div className="sm:col-span-2 md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                وصف البضاعة (يظهر للعميل في التتبع)
              </label>
              <input
                type="text"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                placeholder="مثال: حاوية 40 قدم - منظومات طاقة شمسية ومحولات كهربائية"
                required
                className="w-full bg-[#f6f4ef] border border-[#e6eaeb] focus:border-amber-500 focus:bg-white rounded px-3 py-2 text-xs sm:text-sm outline-none"
              />
            </div>
          </div>
        </div>

        {/* Private Customer and Staff Details */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#e6eaeb] shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#e6eaeb]">
            <h2 className="text-base font-bold text-[#102b3b]">بيانات العميل والملاحظات الداخلية</h2>
            <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              خاصة بالفريق فقط — لا تظهر في التتبع العام
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">اسم العميل / الشركة</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="اسم العميل أو المؤسسة"
                className="w-full bg-[#f6f4ef] border border-[#e6eaeb] focus:border-amber-500 focus:bg-white rounded px-3 py-2 text-xs sm:text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">رقم هاتف العميل</label>
              <input
                type="tel"
                dir="ltr"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+967 …"
                className="w-full bg-[#f6f4ef] border border-[#e6eaeb] focus:border-amber-500 focus:bg-white rounded px-3 py-2 text-xs sm:text-sm font-manrope outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">ملاحظات ومتابعة داخلية</label>
              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                rows={2}
                placeholder="تعليمات الدفع، اسم المخلص الجمركي، تفاصيل المعاينة، إلخ…"
                className="w-full bg-[#f6f4ef] border border-[#e6eaeb] focus:border-amber-500 focus:bg-white rounded px-3 py-2 text-xs sm:text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-[#db8c42] hover:bg-[#b96b25] text-slate-900 font-bold px-6 py-2.5 rounded text-xs sm:text-sm inline-flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Save size={16} />
              <span>{isEditing ? 'حفظ تعديلات الشحنة' : 'حفظ وإنشاء الشحنة'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Timeline Events Manager (for existing shipments) */}
      {isEditing && existingShipment && (
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#e6eaeb] shadow-xs">
          <h2 className="text-base font-bold text-[#102b3b] mb-1">سجل حركة الشحنة (التحديثات المباشرة)</h2>
          <p className="text-xs text-slate-500 mb-6">
            هذه التحديثات تظهر مباشرة للعميل عند إدخال رقم التتبع في الموقع الرئيسي.
          </p>

          {/* Add Event Form */}
          <form
            onSubmit={handleAddEvent}
            className="p-4 bg-[#f6f4ef] rounded-lg border border-[#e6eaeb] mb-8"
          >
            <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <Plus size={15} className="text-amber-600" />
              <span>إضافة مرحلة / تحديث جديد للسجل</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-3">
              <div className="sm:col-span-6">
                <input
                  type="text"
                  value={newEventMsg}
                  onChange={(e) => setNewEventMsg(e.target.value)}
                  placeholder="نص التحديث (مثال: وصلت الشحنة إلى الميناء وبدأت إجراءات التخليص)"
                  required
                  className="w-full bg-white border border-[#e6eaeb] focus:border-amber-500 rounded px-3 py-2 text-xs outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <input
                  type="text"
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  placeholder="الموقع (مثال: ميناء الحديدة)"
                  required
                  className="w-full bg-white border border-[#e6eaeb] focus:border-amber-500 rounded px-3 py-2 text-xs outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <input
                  type="datetime-local"
                  dir="ltr"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  required
                  className="w-full bg-white border border-[#e6eaeb] focus:border-amber-500 rounded px-3 py-2 text-xs font-manrope outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#102b3b] hover:bg-[#183343] text-white px-4 py-1.5 rounded text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>إضافة التحديث للسجل</span>
              </button>
            </div>
          </form>

          {/* Existing Events List */}
          <div className="space-y-4">
            {existingShipment.events.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">لا توجد تحديثات مضافة بعد.</p>
            ) : (
              existingShipment.events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <div>
                      <strong className="block text-xs sm:text-sm font-semibold text-slate-900 mb-1">
                        {ev.message}
                      </strong>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-amber-600" />
                          <span>{ev.location}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-slate-400" />
                          <span>{formatDate(ev.occurredAt, true)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteShipmentEvent(existingShipment.id, ev.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                    title="حذف هذا التحديث"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
