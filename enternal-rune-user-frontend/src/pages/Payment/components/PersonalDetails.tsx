import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Address } from '@/types/Address';
import { useToast } from '@/hooks/useToast';

interface PersonalDetailsProps {
    formData: {
        fullName: string;
        email: string;
        street: string;
        city: string;
        district: string;
        ward: string;
    };
    onInputChange: (field: string, value: string) => void;
}

const PersonalDetails = ({ formData, onInputChange }: PersonalDetailsProps) => {
    const toast = useToast();
    const { user, addUserAddress } = useAuth();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        streetName: '',
        wardName: '',
        cityName: '',
        countryName: 'Việt Nam'
    });
    const [loading, setLoading] = useState(false);

    // 🟦 Selected address id state
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

    const addresses = user?.userAddress ?? [];

    // 🟦 Prefill dữ liệu từ user khi component load
    useEffect(() => {
        if (!user) return;

        if (user.userName) onInputChange("fullName", user.userName);
        if (user.userEmail) onInputChange("email", user.userEmail);

        if (addresses.length > 0) {
            const firstAddress = addresses[0];
            setSelectedAddressId(firstAddress.addressId);
            onInputChange("street", firstAddress.streetName || "");
            onInputChange("city", firstAddress.cityName || "");
            onInputChange("district", firstAddress.wardName || "");
            onInputChange("ward", firstAddress.wardName || "");
        }
    }, [user]);

    // 🟦 Validate
    const patterns = {
        fullName: /^[a-zA-ZÀ-ỹ\s]{2,50}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        streetName: /^.{2,200}$/
    };

    const validateField = (field: string, value: string): string => {
        switch (field) {
            case 'fullName':
                if (!value.trim()) return '';
                if (!patterns.fullName.test(value)) return 'Họ tên chỉ chứa chữ cái và khoảng trắng (2-50 ký tự)';
                return '';
            case 'email':
                if (!value.trim()) return '';
                if (!patterns.email.test(value)) return 'Email không hợp lệ';
                return '';
            case 'street':
                if (!value.trim()) return '';
                if (!patterns.streetName.test(value)) return 'Tên đường phải từ 2-200 ký tự';
                return '';
            default:
                return '';
        }
    };

    const handleChange = (field: string, value: string) => {
        onInputChange(field, value);
        if (touched[field]) {
            setErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
        }
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        setErrors(prev => ({
            ...prev,
            [field]: validateField(field, formData[field as keyof typeof formData])
        }));
    };

    const handleAddAddress = async () => {
        if (!newAddress.streetName.trim() || !newAddress.wardName.trim() || !newAddress.cityName.trim()) {
            toast.error('Vui lòng điền đầy đủ thông tin địa chỉ');
            return;
        }

        try {
            setLoading(true);
            
            const addedAddress = await addUserAddress(newAddress);

            toast.success('Đã thêm địa chỉ mới');

            if (addedAddress) {

                // Cập nhật select option về địa chỉ mới
                setSelectedAddressId(addedAddress.addressId);

                // Cập nhật formData với địa chỉ mới
                onInputChange("street", addedAddress.streetName || "");
                onInputChange("city", addedAddress.cityName || "");
                onInputChange("district", addedAddress.wardName || "");
                onInputChange("ward", addedAddress.wardName || "");
            }

            // Reset form nhưng giữ form mở
            setNewAddress({
                streetName: '',
                wardName: '',
                cityName: '',
                countryName: 'Việt Nam'
            });

            setShowAddressForm(false);
        } catch (err: any) {
            toast.error("Đã có lỗi xảy ra, xin vui lòng thử lại")
            console.error('Lỗi khi thêm địa chỉ:', err);
            alert(err.message || 'Không thể thêm địa chỉ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Thông tin cá nhân</h2>

            <div className="space-y-6">
                {/* Họ tên + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Họ tên */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                        <input
                            disabled
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => handleChange("fullName", e.target.value)}
                            onBlur={() => handleBlur("fullName")}
                            placeholder="Nguyễn Văn A"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition 
                            ${errors.fullName && touched.fullName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                        />
                        {errors.fullName && touched.fullName && (
                            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            disabled
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            onBlur={() => handleBlur("email")}
                            placeholder="example@mail.com"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition 
                            ${errors.email && touched.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
                        />
                        {errors.email && touched.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>
                </div>

                {/* Địa chỉ Select + Button */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ đã lưu <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                        <select
                            value={selectedAddressId || ''}
                            onChange={(e) => {
                                setSelectedAddressId(e.target.value);
                                const selected = addresses.find(addr => addr.addressId === e.target.value);
                                if (selected) {
                                    onInputChange("street", selected.streetName || "");
                                    onInputChange("city", selected.cityName || "");
                                    onInputChange("ward", selected.wardName || "");
                                    onInputChange("district", selected.wardName || "");
                                }
                            }}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {addresses.length === 0 && <option value="">Chưa có địa chỉ</option>}
                            {addresses.map(addr => (
                                <option key={addr.addressId} value={addr.addressId}>
                                    {addr.streetName}, {addr.wardName}, {addr.cityName}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={() => setShowAddressForm(!showAddressForm)}
                            className={`px-4 py-3 rounded-lg transition font-medium ${showAddressForm
                                ? 'bg-gray-600 hover:bg-gray-700'
                                : 'bg-blue-600 hover:bg-blue-700'
                                } text-white`}
                            title={showAddressForm ? "Đóng form" : "Thêm địa chỉ mới"}
                        >
                            {showAddressForm ? '−' : '+'}
                        </button>
                    </div>
                </div>

                {/* Form thêm địa chỉ mới */}
                {showAddressForm && (
                    <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thêm địa chỉ mới</h3>

                        <div className="space-y-4">
                            {/* Tỉnh/Thành phố */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tỉnh/Thành phố <span className="text-red-500">*</span></label>
                                <select
                                    value={newAddress.cityName}
                                    onChange={(e) => setNewAddress(prev => ({ ...prev, cityName: e.target.value }))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Chọn tỉnh/thành</option>
                                    <option value="Hà Nội">Hà Nội</option>
                                    <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                                    <option value="Đà Nẵng">Đà Nẵng</option>
                                    <option value="Hải Phòng">Hải Phòng</option>
                                    <option value="Cần Thơ">Cần Thơ</option>
                                </select>
                            </div>

                            {/* Quận/Huyện */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quận/Huyện <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={newAddress.wardName}
                                    onChange={(e) => setNewAddress(prev => ({ ...prev, wardName: e.target.value }))}
                                    placeholder="Nhập quận/huyện"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Số nhà, tên đường */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Số nhà, tên đường <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={newAddress.streetName}
                                    onChange={(e) => setNewAddress(prev => ({ ...prev, streetName: e.target.value }))}
                                    placeholder="VD: 12 Nguyễn Văn Bảo"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddressForm(false)}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                    disabled={loading}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddAddress}
                                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? 'Đang thêm...' : 'Thêm địa chỉ'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PersonalDetails;
