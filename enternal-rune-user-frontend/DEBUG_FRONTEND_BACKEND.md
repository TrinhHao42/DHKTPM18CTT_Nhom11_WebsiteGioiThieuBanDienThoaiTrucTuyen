# Hướng dẫn Debug: Frontend không hiển thị dữ liệu từ Backend

## 🔍 Các bước kiểm tra

### 1. Kiểm tra cấu hình AxiosInstance

**File:** `src/configs/AxiosInstance.ts`

```typescript
const BACK_END_URL = process.env.BACK_END_URL || 'http://localhost:8080'
```

**Kiểm tra:**
- ✅ Backend có đang chạy ở `http://localhost:8080` không?
- ✅ Nếu backend chạy ở port khác, cập nhật biến môi trường `BACK_END_URL`
- ✅ Tạo file `.env.local` với: `BACK_END_URL=http://localhost:YOUR_PORT`

### 2. Kiểm tra API Routes

**File:** `src/router/router.ts`

Các endpoint:
- `/products/top-brand` - Sản phẩm nổi bật
- `/products/latest` - Sản phẩm mới nhất
- `/products/filter` - Lọc sản phẩm
- `/products/{id}/active-price` - Chi tiết sản phẩm

**Kiểm tra:**
- ✅ Backend có endpoint này không?
- ✅ Method (GET/POST) có đúng không?
- ✅ Response format có đúng không?

### 3. Kiểm tra Response từ Backend

**Mở DevTools (F12) → Network tab:**

1. Xem request có được gửi đi không
2. Status code là gì? (200 = OK, 404 = Not Found, 500 = Server Error)
3. Response body có dữ liệu không?

**Ví dụ response đúng:**
```json
[
  {
    "prodId": 1,
    "prodName": "iPhone 15",
    "productPrices": [{"ppPrice": 20000000}],
    ...
  }
]
```

### 4. Kiểm tra Context có nhận data không

**File:** `src/context/ProductsContext.tsx`

Thêm console.log để debug:

```typescript
const fetchProducts = async () => {
    setLoading(true)
    setError(null)

    try {
        console.log('🔄 Fetching products from:', API_ROUTES.PRODUCTS_TOP_BRAND)
        const productsRes = await AxiosInstance.get(API_ROUTES.PRODUCTS_TOP_BRAND)
        console.log('✅ Response status:', productsRes.status)
        console.log('✅ Response data:', productsRes.data)
        console.log('✅ Data type:', Array.isArray(productsRes.data) ? 'Array' : typeof productsRes.data)
        
        if (!productsRes || productsRes.status !== 200) {
            throw new Error("Không thể tải dữ liệu sản phẩm.")
        }
        
        // Kiểm tra data có phải array không
        const productsData = Array.isArray(productsRes.data) 
            ? productsRes.data 
            : (productsRes.data?.content || [])
        
        console.log('✅ Products to set:', productsData)
        setProducts(productsData)
        
        const productLatest = await AxiosInstance.get(API_ROUTES.PRODUCTS_LATEST)
        const latestData = Array.isArray(productLatest.data) 
            ? productLatest.data 
            : (productLatest.data?.content || [])
        setProductLatest(latestData)
    } catch (err) {
        console.error("❌ Error fetching products:", err)
        console.error("❌ Error details:", {
            message: err instanceof Error ? err.message : 'Unknown error',
            response: err.response?.data,
            status: err.response?.status
        })
        setError(err instanceof Error ? err.message : "Lỗi không xác định khi tải dữ liệu")
    } finally {
        setLoading(false)
    }
}
```

### 5. Kiểm tra Component có render data không

**File:** `src/pages/Home/components/ProductList.tsx`

Thêm debug:

```typescript
export default function ProductList() {
    const { products, productLatest, loading, error } = useProducts();

    console.log('📦 ProductList render:', {
        productsCount: products.length,
        productLatestCount: productLatest.length,
        loading,
        error
    });

    // ... rest of code
}
```

### 6. Các lỗi thường gặp

#### ❌ Lỗi: "Network Error" hoặc "CORS"
**Nguyên nhân:** Backend không cho phép CORS từ frontend
**Giải pháp:** Backend cần thêm CORS headers:
```java
@CrossOrigin(origins = "http://localhost:3000")
```

#### ❌ Lỗi: 404 Not Found
**Nguyên nhân:** Endpoint không đúng
**Giải pháp:** Kiểm tra lại API_ROUTES và endpoint trong backend

#### ❌ Lỗi: 401 Unauthorized
**Nguyên nhân:** Token không hợp lệ hoặc thiếu
**Giải pháp:** Kiểm tra localStorage có token không

#### ❌ Data là array rỗng []
**Nguyên nhân:** 
- Backend trả về format khác (ví dụ: `{content: [...]}`)
- Backend không có dữ liệu
**Giải pháp:** Kiểm tra response format và xử lý đúng

#### ❌ Data có nhưng không hiển thị
**Nguyên nhân:**
- Component không re-render khi state thay đổi
- Key prop không đúng
- Conditional rendering sai
**Giải pháp:** Kiểm tra console.log và React DevTools

### 7. Công cụ Debug

1. **Browser DevTools (F12)**
   - Network tab: Xem requests/responses
   - Console tab: Xem logs và errors
   - React DevTools: Xem component state

2. **Thêm logging tạm thời:**
```typescript
// Trong component
useEffect(() => {
    console.log('Products changed:', products)
}, [products])
```

3. **Test API trực tiếp:**
```bash
# Dùng curl hoặc Postman
curl http://localhost:8080/products/top-brand
```

### 8. Checklist Debug

- [ ] Backend đang chạy?
- [ ] BACK_END_URL đúng?
- [ ] API endpoint đúng?
- [ ] Response có data?
- [ ] Response format đúng? (Array hay Object?)
- [ ] Context có set state đúng?
- [ ] Component có nhận props đúng?
- [ ] Console có error không?
- [ ] Network tab có request không?

