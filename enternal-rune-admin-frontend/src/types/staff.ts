// 
export interface AddressResponse {
    addressId: number | null;
    streetName: string;
    wardName: string;
    cityName: string;
    countryName: string;
}

export interface Role {
    id: number;
    roleName: string;
}

// export interface StaffRequest {
//     name: string;
//     email: string;
//     status: boolean;
//     password?: string;          // ⬅ password optional (dùng khi create)
//     role: Role;
//     address: AddressResponse;
// }
export interface StaffRequest {
    name: string;
    email: string;
    status: boolean;
    password?: string;
    role: {
        id: number;
        roleName: string; // dùng cho view
    };
    address: {
        addressId: number;
        streetName: string;
        wardName: string;
        cityName: string;
        countryName: string;
    };
}


export interface StaffResponse {
    id: number;
    name: string;
    email: string;
    status: boolean;
    role: Role;
    address: AddressResponse;
}

export interface StaffStatisticsResponse {
    totalStaff: number;
    totalStaffActivated: number;
    totalStaffNotActivated: number;
    presenceRate: number;
}
