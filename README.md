# PRN232 Mobile Application

## Giới Thiệu

Đồ án xây dựng ứng dụng thương mại điện tử di động sử dụng React Native framework với Expo platform. Ứng dụng cung cấp các chức năng cơ bản của một hệ thống e-commerce bao gồm quản lý sản phẩm, giỏ hàng, và xác thực người dùng.

## Công Nghệ Sử Dụng

### Framework Core
- React Native 0.81.5 - Framework phát triển ứng dụng di động đa nền tảng
- Expo 54.0.32 - Platform và toolchain cho React Native
- React 19.1.0 - Thư viện xây dựng giao diện người dùng
- TypeScript 5.9.2 - Ngôn ngữ lập trình strongly-typed

### Navigation
- Expo Router 6.0.22 - File-based routing system
- React Navigation 7.1.8 - Navigation library với Bottom Tabs support

### Backend & Authentication
- Firebase 12.8.0 - Backend-as-a-Service platform
  - Firebase Authentication - Quản lý xác thực người dùng
  - Google OAuth integration - Đăng nhập bằng tài khoản Google
- AsyncStorage 2.2.0 - Persistent local storage

### UI Libraries
- React Native Reanimated 4.1.1 - Animation library
- React Native Gesture Handler 2.28.0 - Gesture handling system
- Expo Vector Icons 15.0.3 - Icon library

### Development Tools
- ESLint 9.25.0 - Code quality và linting
- Expo CLI - Development và build tools

## Cấu Trúc Dự Án

```
PRN232-Mobile/
├── app/                      # Các màn hình ứng dụng (file-based routing)
│   ├── (tabs)/              # Tab navigation
│   │   ├── index.tsx        # Trang chủ
│   │   ├── categories.tsx   # Danh mục sản phẩm
│   │   ├── cart.tsx         # Giỏ hàng
│   │   └── account.tsx      # Tài khoản người dùng
│   ├── login.tsx            # Màn hình đăng nhập
│   └── register.tsx         # Màn hình đăng ký
├── components/              # Các component tái sử dụng
│   ├── ui/                  # UI components cơ bản
│   ├── ProductCard.tsx      # Card hiển thị sản phẩm
│   ├── CategoryCard.tsx     # Card hiển thị danh mục
│   ├── HomeHeader.tsx       # Header trang chủ
│   └── ...
├── contexts/                # React Context providers
│   └── AuthContext.tsx      # Context xác thực người dùng
├── services/                # Các service layer
│   └── api.ts              # API service với auto-auth headers
├── config/                  # Configuration files
│   ├── firebase.ts         # Firebase configuration
│   └── constants.ts        # Các hằng số ứng dụng
├── hooks/                   # Custom React hooks
├── data/                    # Mock data hoặc static data
└── assets/                  # Hình ảnh, font, resources

```

## Chức Năng Chính

### Module Xác Thực
- Đăng ký và đăng nhập với Email/Password
- Đăng nhập với Google OAuth 2.0
- Quên mật khẩu và khôi phục tài khoản
- Lưu trữ session với AsyncStorage
- Token-based authentication với Firebase

### Module Sản Phẩm
- Hiển thị danh sách sản phẩm theo danh mục
- Xem chi tiết thông tin sản phẩm
- Tìm kiếm và lọc sản phẩm

### Module Giỏ Hàng
- Thêm và xóa sản phẩm
- Điều chỉnh số lượng sản phẩm
- Tính toán tổng giá trị đơn hàng

### Module Tài Khoản
- Quản lý thông tin người dùng
- Cập nhật profile
- Đăng xuất khỏi hệ thống

## Hướng Dẫn Cài Đặt

### Yêu Cầu Hệ Thống
- Node.js phiên bản 18.x trở lên
- npm hoặc yarn package manager
- Expo CLI
- Android Studio (phát triển Android) hoặc Xcode (phát triển iOS)

### Các Bước Cài Đặt

1. Clone repository
```bash
git clone https://github.com/hienn12454/PRN232-Mobile.git
cd PRN232-Mobile
```

2. Cài đặt dependencies
```bash
npm install
```

3. Cấu hình Firebase
- Tạo project trên Firebase Console
- Tải file cấu hình `google-services.json` (Android) và `GoogleService-Info.plist` (iOS)
- Đặt các file vào thư mục root của project
- Cập nhật Firebase configuration trong `config/constants.ts`

4. Chạy ứng dụng
```bash
npm start          # Khởi động development server
npm run android    # Chạy trên Android
npm run ios        # Chạy trên iOS
```

## Kiến Trúc Ứng Dụng

### Authentication Flow
```
User → Login Screen → Firebase Auth → Get ID Token → API Service → Backend
```

### API Integration
Ứng dụng sử dụng một API service layer (`services/api.ts`) tự động thêm Firebase ID token vào mọi request:
- Tự động refresh token khi hết hạn
- Centralized error handling
- Type-safe request/response

### State Management
- **AuthContext**: Quản lý trạng thái xác thực toàn cục
- **React Hooks**: useState, useEffect cho local state
- **AsyncStorage**: Persist data across app sessions

## 🎨 Theming & Styling

Ứng dụng hỗ trợ:
- Dark Mode / Light Mode tự động
- Theme constants trong `constants/theme.ts`
- Themed components với custom hooks
- Responsive design cho nhiều kích thước màn hình

## 🔐 Bảo Mật

- ✅ Firebase Authentication với secure token
- ✅ Encrypted AsyncStorage
- ✅ HTTPS cho mọi API request
- ✅ Auto token refresh
- ✅ Secure credential storage

## License

Private project - © 2026 PRN232 Team



**Note**:Vui lòng cập nhật Firebase credentials và API endpoints trước khi sử dụng.
AuthContext: Quản lý trạng thái xác thực toàn cục
- React Hooks: useState, useEffect cho component state
- AsyncStorage: Lưu trữ dữ liệu persistent

## Tính Năng Kỹ Thuật

### User Interface
- Hỗ trợ Dark Mode và Light Mode
- Responsive design cho nhiều kích thước màn hình
- Custom theme system với constants
- Animation và gesture handling

### Bảo Mật
- Firebase Authentication với JWT token
- Secure credential storage với AsyncStorage
- HTTPS cho tất cả API requests
- Automatic token refresh mechanism

