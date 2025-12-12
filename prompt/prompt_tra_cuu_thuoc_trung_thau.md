# Prompt Tra Cứu Thuốc Trúng Thầu – Phiên bản Hoàn Chỉnh

## 🎯 Mục tiêu
Sử dụng prompt này để yêu cầu AI (GPT/ChatGPT) tiếp tục xây dựng hoặc mở rộng tính năng **Tra cứu thuốc trúng thầu – Smart Pricing** trong ứng dụng **React Native (JavaScript)** sử dụng **NativeWind**.

---

# 🧩 PROMPT — BẢN HOÀN CHỈNH

**Hãy giúp tôi tiếp tục phát triển tính năng tra cứu thuốc trúng thầu trong ứng dụng React Native thuần JavaScript.  
Yêu cầu như sau:**

## 1. Gọi API Smart Pricing
Endpoint:
```
POST https://muasamcong.mpi.gov.vn/o/egp-portal-personal-page/services/smart/search_prc
```

Body chuẩn:
```json
[
  {
    "pageSize": 20,
    "pageNumber": 0,
    "query": [
      {
        "index": "es-smart-pricing",
        "keyWord": "{keyword}",
        "keyWordNotMatch": "",
        "matchType": "exact",
        "matchFields": ["ten_thuoc", "ten_hoat_chat", "ma_tbmt"],
        "filters": [
          { "fieldName": "medicines", "searchType": "in", "fieldValues": ["0"] },
          { "fieldName": "type", "searchType": "in", "fieldValues": ["HANG_HOA"] },
          { "fieldName": "tab", "searchType": "in", "fieldValues": ["THUOC_TAN_DUOC"] }
        ]
      }
    ]
  }
]
```

❗ Không sử dụng Cookie.  
❗ Sử dụng axios hoặc fetch đều được.

---

## 2. UI React Native (NativeWind)
Sử dụng className để style.

Cần có:

### ⭐ Input tìm kiếm
- TextInput nhập keyword
- Nút **Tìm kiếm**
- Nút **X** để xóa keyword + xóa dữ liệu

### ⭐ Danh sách kết quả
Mỗi item hiển thị:
- `tenThuoc`
- `tenHoatChat`
- `nhomThuoc`
- `donGia`
- `donViTinh`
- `soLuong`
- `soQuyetDinh`
- `ngayBanHanhQuyetDinh` → định dạng DD/MM/YYYY
- `diaDiem[0].provName`
- `maTbmt` + nút **Copy**

### ⭐ Yêu cầu UI
- Thiết kế đẹp, bo góc 12–16
- Shadow nhẹ
- Khoảng cách hợp lý (padding 12–16)
- Text hierarchy rõ ràng
- Loading indicator khi fetch
- Hiển thị lỗi đẹp (VD: không tìm thấy kết quả)

---

## 3. Format ngày tháng (yêu cầu cố định)
```
DD/MM/YYYY
```

---

## 4. Trả về code theo cấu trúc:
- Component hoàn chỉnh
- Có state: keyword, data, loading, error
- Có hàm formatDate()
- Có hàm copyToClipboard()
- Code phải chạy ngay

---

# 📦 MẪU DỮ LIỆU TRẢ VỀ CỦA API (Sample JSON)

```json
{
  "page": {
    "content": [
      {
        "tenThuoc": "Goldridons",
        "tenHoatChat": "Paracetamol 500mg",
        "nhomThuoc": "Thuốc giảm đau – hạ sốt",
        "donGia": 12500,
        "donViTinh": "Viên",
        "soLuong": 50000,
        "soQuyetDinh": "123/QĐ-SYT",
        "ngayBanHanhQuyetDinh": "2024-03-12T00:00:00Z",
        "diaDiem": [
          { "provName": "TP Hồ Chí Minh" }
        ],
        "maTbmt": "IB23000345"
      }
    ]
  }
}
```

---

# 🎯 Mục đích file
Bạn chỉ cần copy prompt này và gửi vào bất kỳ phiên bản ChatGPT/GPT nào để tiếp tục:

- mở rộng UI  
- sửa lỗi  
- cải tiến logic  
- tạo component mới  
- viết lại theo NativeWind  
- viết lại theo Expo Router  
- viết lại theo TypeScript  

---

# ✔ Ghi chú mở rộng
Nếu tôi yêu cầu “viết thêm”, “hoàn thiện”, “mở rộng”, “làm đẹp UI”, “tối ưu API”, bạn hãy dựa trên prompt này để tiếp tục phát triển.

---

# 📌 Kết thúc
Prompt đã hoàn chỉnh, dùng được dài hạn cho mọi tài khoản GPT khác nhau.
