import React, { useState } from 'react';
import { Users, UserPlus, Shield, Trash2, Check, UserCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StaffUser, UserRole } from '../../types';
import { formatDate } from '../common';

export const StaffManager: React.FC = () => {
  const { staff, addStaff, removeStaff, currentUser } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('staff');
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<StaffUser | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addStaff({
      name: name.trim(),
      email: email.trim(),
      role,
    });

    setName('');
    setEmail('');
    setRole('staff');
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  const confirmDelete = () => {
    if (staffToDelete) {
      removeStaff(staffToDelete.id);
      setStaffToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#102b3b]">الموظفون والصلاحيات</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          الموظف يدير الشحنات والطلبات. المدير يدير الفريق والأسعار أيضاً.
        </p>
      </div>

      {/* Add Staff Card */}
      <div className="bg-white p-6 rounded-xl border border-[#e6eaeb] shadow-xs">
        <h2 className="text-sm font-bold text-[#102b3b] mb-4 flex items-center gap-2">
          <UserPlus size={16} className="text-amber-600" />
          <span>إضافة موظف / منح صلاحية وصول</span>
        </h2>

        {addedSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded text-xs mb-4 flex items-center gap-2">
            <Check size={14} className="text-emerald-600" />
            <span>تم إضافة العضو بنجاح!</span>
          </div>
        )}

        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-4">
            <input
              type="text"
              placeholder="اسم الموظف"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[#f6f4ef] border border-[#e6eaeb] focus:border-amber-500 focus:bg-white rounded px-3 py-2 text-xs outline-none"
            />
          </div>

          <div className="sm:col-span-4">
            <input
              type="email"
              dir="ltr"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#f6f4ef] border border-[#e6eaeb] focus:border-amber-500 focus:bg-white rounded px-3 py-2 text-xs font-manrope outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-[#f6f4ef] border border-[#e6eaeb] rounded px-3 py-2 text-xs font-semibold outline-none cursor-pointer"
            >
              <option value="staff">موظف شحنات</option>
              <option value="admin">مدير نظام</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full bg-[#db8c42] hover:bg-[#b96b25] text-slate-900 font-bold py-2 rounded text-xs transition-colors cursor-pointer"
            >
              إضافة
            </button>
          </div>
        </form>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-xl border border-[#e6eaeb] shadow-xs overflow-hidden">
        <table className="w-full text-right text-xs">
          <thead className="bg-[#f6f4ef] text-slate-500 font-semibold border-b border-[#e6eaeb]">
            <tr>
              <th className="p-4">اسم الموظف</th>
              <th className="p-4">البريد الإلكتروني</th>
              <th className="p-4">الدور / الصلاحية</th>
              <th className="p-4">تاريخ الإضافة</th>
              <th className="p-4 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e6eaeb]">
            {staff.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                      {member.name.slice(0, 1)}
                    </span>
                    <strong className="text-slate-800">{member.name}</strong>
                  </div>
                </td>
                <td className="p-4" dir="ltr">
                  <span className="font-manrope text-slate-600 text-right block">
                    {member.email}
                  </span>
                </td>
                <td className="p-4">
                  {member.role === 'admin' ? (
                    <span className="inline-flex items-center gap-1 text-purple-800 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                      <Shield size={12} />
                      <span>مدير النظام</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                      <UserCheck size={12} />
                      <span>موظف شحنات</span>
                    </span>
                  )}
                </td>
                <td className="p-4 text-slate-500">{formatDate(member.createdAt)}</td>
                <td className="p-4 text-center">
                  {member.id !== currentUser?.id ? (
                    <button
                      onClick={() => setStaffToDelete(member)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      title="إزالة الصلاحية"
                    >
                      <Trash2 size={15} />
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400">حسابك الحالي</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Dialog */}
      {staffToDelete && (
        <div className="modal-backdrop fixed inset-0 z-50 bg-[#102b3b]/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">إزالة صلاحيات الموظف؟</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              سيتم إزالة صلاحيات <strong className="text-slate-900">{staffToDelete.name}</strong> من الوصول إلى لوحة تحكم التطبيق.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setStaffToDelete(null)}
                className="px-4 py-2 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded text-xs font-bold bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              >
                تأكيد الإزالة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
