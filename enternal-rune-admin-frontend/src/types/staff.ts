export interface AddressResponse {
    addressId: number|null;
    streetName: string;
    wardName: string;
    cityName: string;
    countryName: string;
}
export interface Role {
    id?: number;
    roleName: string
}
export interface StaffRequest {
    name: string;
    email: string;
    role: Role;
    status: boolean;
    password: string;
    address: AddressResponse;
}
export interface StaffResponse {
    id?: number;
    name: string;
    email: string;
    role: Role;
    status: boolean;
    password: string;
    address: AddressResponse;
}
export interface StaffStatisticsResponse {
    totalStaff: number;
    totalStaffActivated: number;
    totalStaffNotActivated: number;
    presenceRate: number;
}